
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const WORKER_URL = import.meta.env.WORKER_URL;

const GalleryPanel = ({
  items = [],
  currentUser,
  loading = false,
  onGalleryUploaded,
}) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "image",
    file: null,
    preview: null,
  });

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = currentUser?.role === "admin";

  /*
   * Load gallery media from the private R2 bucket
   */
  useEffect(() => {
    let objectUrls = [];

    const loadGalleryMedia = async () => {
      if (!items.length) {
        setGalleryItems([]);
        setLoadingMedia(false);
        return;
      }

      setLoadingMedia(true);
      setError("");

      try {
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const accessToken =
          sessionData.session?.access_token;

        if (!accessToken) {
          throw new Error(
            "No authentication token found."
          );
        }

        const loadedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(
                `${WORKER_URL}/gallery/${item.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to load ${item.file_name}`
                );
              }

              const blob =
                await response.blob();

              const objectUrl =
                URL.createObjectURL(blob);

              objectUrls.push(objectUrl);

              return {
                ...item,
                src: objectUrl,
              };
            } catch (itemError) {
              console.error(
                `Error loading gallery item ${item.id}:`,
                itemError
              );

              return {
                ...item,
                src: null,
              };
            }
          })
        );

        setGalleryItems(loadedItems);
      } catch (error) {
        console.error(
          "Error loading gallery media:",
          error
        );

        setError(
          "Failed to load gallery media."
        );

        setGalleryItems([]);
      } finally {
        setLoadingMedia(false);
      }
    };

    loadGalleryMedia();

    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [items]);

  /*
   * Clean up temporary upload preview
   */
  useEffect(() => {
    return () => {
      if (formData.preview) {
        URL.revokeObjectURL(
          formData.preview
        );
      }
    };
  }, [formData.preview]);

  /*
   * Handle selecting an image or video
   */
  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploadMessage("");

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError(
        "Please select an image or video."
      );
      return;
    }

    if (
      file.size >
      100 * 1024 * 1024
    ) {
      setError(
        "File is too large. Maximum file size is 100 MB."
      );
      return;
    }

    /*
     * Revoke the previous preview before
     * creating a new one.
     */
    if (formData.preview) {
      URL.revokeObjectURL(
        formData.preview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setFormData((previous) => ({
      ...previous,
      file,
      preview,
      type: isVideo
        ? "video"
        : "image",
    }));
  };

  /*
   * Upload gallery media
   */
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError(
        "Please enter a title."
      );
      return;
    }

    if (!formData.file) {
      setError(
        "Please select an image or video."
      );
      return;
    }

    setUploading(true);
    setError("");
    setUploadMessage("");

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "You are not authenticated."
        );
      }

      /*
       * Upload the actual file to Cloudflare R2
       */
      const response = await fetch(
        `${WORKER_URL}/gallery/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-File-Name":
              formData.file.name,
            "Content-Type":
              formData.file.type,
          },
          body: formData.file,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Gallery upload failed."
        );
      }

      console.log(
        "Gallery R2 upload successful:",
        result
      );

      /*
       * Save the R2 file metadata in Supabase
       */
      const {
        data: galleryItem,
        error: galleryError,
      } = await supabase
        .from("gallery")
        .insert({
          title:
            formData.title.trim(),
          type: formData.type,
          file_name:
            result.fileName,
          file_key:
            result.fileKey,
          file_type:
            result.contentType,
          file_size:
            formData.file.size,
          uploaded_by:
            currentUser.id,
        })
        .select()
        .single();

      if (galleryError) {
        throw galleryError;
      }

      console.log(
        "Gallery item saved:",
        galleryItem
      );

      setUploadMessage(
        "Gallery media uploaded successfully."
      );

      /*
       * Reset the form.
       */
      setFormData({
        title: "",
        type: "image",
        file: null,
        preview: null,
      });

      /*
       * Refresh gallery metadata.
       */
      if (onGalleryUploaded) {
        await onGalleryUploaded();
      }
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error
      );

      setError(
        error.message ||
          "Failed to upload gallery media."
      );
    } finally {
      setUploading(false);
    }
  };

  /*
   * Delete gallery media
   */
  const handleDelete = async (item) => {
    const confirmed =
      window.confirm(
        `Delete "${item.title}" from the gallery?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    setUploadMessage("");

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "You are not authenticated."
        );
      }

      /*
       * Tell the Worker to delete:
       *
       * 1. The actual file from R2
       * 2. The metadata from Supabase
       */
      const response = await fetch(
        `${WORKER_URL}/gallery/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to delete gallery item."
        );
      }

      console.log(
        "Gallery item deleted:",
        result
      );

      /*
       * Remove the item from the UI immediately.
       */
      setGalleryItems((previous) =>
        previous.filter(
          (galleryItem) =>
            galleryItem.id !== item.id
        )
      );

      /*
       * Refresh the gallery metadata
       * in HomePage.
       */
      if (onGalleryUploaded) {
        await onGalleryUploaded();
      }
    } catch (error) {
      console.error(
        "Gallery delete error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete gallery item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Admin Upload Section */}
      {isAdmin && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Upload to Gallery
          </h2>

          <form
            onSubmit={handleUpload}
            className="space-y-4"
          >
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      title:
                        event.target.value,
                    })
                  )
                }
                placeholder="Enter gallery title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Type
              </label>

              <select
                value={formData.type}
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      type:
                        event.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="image">
                  Image
                </option>

                <option value="video">
                  Video
                </option>
              </select>
            </div>

            {/* File */}
            <div>
              <label
                htmlFor="gallery-file"
                className="inline-block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Choose Image / Video
              </label>

              <input
                id="gallery-file"
                type="file"
                accept="image/*,video/*"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

              {formData.file && (
                <p className="mt-2 text-sm text-gray-600">
                  {formData.file.name}
                </p>
              )}
            </div>

            {/* Upload Preview */}
            {formData.preview && (
              <div className="overflow-hidden rounded-lg border">
                {formData.type ===
                "video" ? (
                  <video
                    src={
                      formData.preview
                    }
                    controls
                    className="max-h-80 w-full object-contain"
                  />
                ) : (
                  <img
                    src={
                      formData.preview
                    }
                    alt="Preview"
                    className="max-h-80 w-full object-contain"
                  />
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Success */}
            {uploadMessage && (
              <p className="text-sm text-green-600">
                {uploadMessage}
              </p>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Upload"}
            </button>
          </form>
        </div>
      )}

      {/* Gallery */}
      <div>
        <h2 className="mb-5 text-xl font-semibold">
          Community Gallery
        </h2>

        {loading || loadingMedia ? (
          <p className="text-gray-500">
            Loading gallery...
          </p>
        ) : galleryItems.length === 0 ? (
          <p className="text-gray-500">
            No gallery items yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  {/* Media */}
                  <div className="aspect-video bg-gray-100">
                    {item.src ? (
                      item.type ===
                      "video" ? (
                        <video
                          src={item.src}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={
                            item.title
                          }
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Unable to load media
                      </div>
                    )}
                  </div>

                  {/* Gallery Information */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.type ===
                          "video"
                            ? "Video"
                            : "Image"}
                        </p>
                      </div>

                      {/* Admin Delete */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          disabled={
                            deletingId ===
                            item.id
                          }
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPanel;
