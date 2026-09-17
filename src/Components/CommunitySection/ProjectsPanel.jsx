
import {
  CalendarDays,
  ChevronDown,
  ImagePlus,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

// ----------------------------------------
// Project Form
// ----------------------------------------

function ProjectForm({
  currentUser,
  onProjectCreated,
}) {
  console.log(
    "PROJECT CURRENT USER:",
    currentUser
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [startDate, setStartDate] =
    useState("");
  const [endDate, setEndDate] =
    useState("");

  const [file, setFile] =
    useState(null);
  const [preview, setPreview] =
    useState(null);

  const [posting, setPosting] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      !selectedFile.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image."
      );
      return;
    }

    if (
      selectedFile.size >
      100 * 1024 * 1024
    ) {
      setError(
        "File is too large. Maximum file size is 100 MB."
      );
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const newPreview =
      URL.createObjectURL(
        selectedFile
      );

    setFile(selectedFile);
    setPreview(newPreview);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError(
        "Please enter a project title."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter a project description."
      );
      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Please select a project timeline."
      );
      return;
    }

    if (endDate < startDate) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select a project image."
      );
      return;
    }

    if (!currentUser?.id) {
      setError(
        "You are not authenticated."
      );
      return;
    }

    setPosting(true);

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          "You are not authenticated."
        );
      }

      const uploadResponse =
        await fetch(
          `${WORKER_URL}/projects/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-File-Name":
                file.name,
              "Content-Type":
                file.type,
            },
            body: file,
          }
        );

      const uploadResult =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.error ||
            "Project image upload failed."
        );
      }

      console.log(
        "Project image uploaded:",
        uploadResult
      );

      const {
        data: project,
        error: projectError,
      } = await supabase
        .from("projects")
        .insert({
          title: title.trim(),
          description:
            description.trim(),
          start_date: startDate,
          end_date: endDate,

          image_file_name:
            uploadResult.fileName,

          image_file_key:
            uploadResult.fileKey,

          image_file_type:
            uploadResult.contentType,

          image_file_size:
            file.size,

          created_by:
            currentUser.id,
        })
        .select()
        .single();

      if (projectError) {
        throw projectError;
      }

      console.log(
        "Project created:",
        project
      );

      if (preview) {
        URL.revokeObjectURL(
          preview
        );
      }

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setFile(null);
      setPreview(null);

      setSuccess(
        "Project posted successfully."
      );

      if (onProjectCreated) {
        await onProjectCreated();
      }
    } catch (error) {
      console.error(
        "Project creation error:",
        error
      );

      setError(
        error.message ||
          "Failed to create project."
      );
    } finally {
      setPosting(false);
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setFile(null);
    setPreview(null);
    setError("");
    setSuccess("");
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#d7d9e0] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.05)] sm:rounded-[30px]">
      {/* Image upload */}
      <label
        htmlFor="project-image"
        className="block cursor-pointer"
      >
        <div className="flex min-h-[220px] w-full items-center justify-center overflow-hidden bg-[#f3f4f6] transition hover:bg-[#eef0f3] sm:min-h-[270px] md:min-h-[310px]">
          {preview ? (
            <img
              src={preview}
              alt="Project preview"
              className="h-[220px] w-full object-cover sm:h-[270px] md:h-[310px]"
            />
          ) : (
            <div className="px-5 py-8 text-center text-[#9c9ea8]">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#d4d7df] bg-white/60 sm:mb-4 sm:h-20 sm:w-20">
                <ImagePlus
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  strokeWidth={1.7}
                />
              </div>

              <p className="text-base tracking-[0.2em] sm:text-lg">
                •••
              </p>

              <p className="mt-2 italic text-[#4e68c8]">
                Drop
              </p>

              <p className="mt-2 text-xs text-[#9c9ea8] sm:text-sm">
                Click to choose an image
              </p>
            </div>
          )}
        </div>
      </label>

      <input
        id="project-image"
        type="file"
        accept="image/*"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      {/* Form */}
      <div className="space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 md:px-8 md:py-7">
        <div className="grid min-w-0 gap-5 md:grid-cols-2 md:gap-6">
          {/* Title */}
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-[#9fa2ad] sm:mb-3 sm:text-[16px]">
              Title
            </span>

            <div className="flex min-w-0 items-center gap-3 border-b border-[#d3d5dc] pb-3">
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Enter project title"
                className="w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-[#b2b5bf] sm:text-[16px]"
              />
            </div>
          </label>

          {/* Timeline */}
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-[#9fa2ad] sm:mb-3 sm:text-[16px]">
              Timeline
            </span>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-[#d3d5dc] pb-3 sm:gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                className="min-w-0 w-full bg-transparent text-sm outline-none sm:text-[16px]"
              />

              <span className="shrink-0 text-xs text-[#9a9ca5] sm:text-sm">
                to
              </span>

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                className="min-w-0 w-full bg-transparent text-sm outline-none sm:text-[16px]"
              />

              <ChevronDown className="hidden h-5 w-5 shrink-0 text-[#9a9ca5] sm:block" />
            </div>
          </label>
        </div>

        {/* Description */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#9fa2ad] sm:mb-3 sm:text-[16px]">
            Description
          </span>

          <textarea
            rows={4}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Write project description"
            className="w-full resize-y rounded-[18px] border border-[#d7d9e0] bg-[#fcfcfd] px-4 py-3 text-[15px] outline-none placeholder:text-[#b2b5bf] focus:border-[#b5c1f7] sm:rounded-[24px] sm:px-5 sm:py-4 sm:text-[16px]"
          />
        </label>

        {/* Selected image */}
        {file && (
          <div className="min-w-0 rounded-[14px] bg-[#f7f8fa] px-3 py-3 sm:px-4">
            <p className="break-all text-xs text-[#6d707b] sm:text-sm">
              Selected image:{" "}
              {file.name}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-[14px] bg-red-50 px-3 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-[14px] bg-green-50 px-3 py-3">
            <p className="text-sm text-green-600">
              {success}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={posting}
            className="w-full rounded-full border border-[#61636c] px-6 py-3 text-sm font-medium text-[#61636c] transition hover:bg-[#f7f7f8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-2.5 sm:text-[16px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={posting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4f6fe8] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-2.5 sm:text-[16px]"
          >
            <CalendarDays
              className="h-4 w-4"
              strokeWidth={2}
            />

            {posting
              ? "Posting..."
              : "Post"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------
// Project Card
// ----------------------------------------

function ProjectCard({
  project,
  currentUser,
  onProjectDeleted,
}) {
  const [imageUrl, setImageUrl] =
    useState(null);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadProjectImage =
      async () => {
        if (!project?.id) {
          return;
        }

        if (!project?.image_file_key) {
          setImageUrl(null);
          return;
        }

        setImageLoading(true);
        setImageError(false);

        try {
          const {
            data: sessionData,
            error: sessionError,
          } =
            await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          const accessToken =
            sessionData.session
              ?.access_token;

          if (!accessToken) {
            throw new Error(
              "Authentication required"
            );
          }

          const response =
            await fetch(
              `${WORKER_URL}/projects/${project.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

          if (!response.ok) {
            let errorMessage =
              "Failed to load project image.";

            try {
              const result =
                await response.json();

              if (result?.error) {
                errorMessage =
                  result.error;
              }
            } catch {
              // Ignore JSON parsing errors
            }

            throw new Error(
              errorMessage
            );
          }

          const blob =
            await response.blob();

          objectUrl =
            URL.createObjectURL(
              blob
            );

          if (!cancelled) {
            setImageUrl(objectUrl);
          }
        } catch (error) {
          console.error(
            "Project image loading error:",
            error
          );

          if (!cancelled) {
            setImageError(true);
            setImageUrl(null);
          }
        } finally {
          if (!cancelled) {
            setImageLoading(false);
          }
        }
      };

    loadProjectImage();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(
          objectUrl
        );
      }
    };
  }, [
    project?.id,
    project?.image_file_key,
  ]);

  const handleDelete = async () => {
    if (!project?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          "You are not authenticated."
        );
      }

      const response =
        await fetch(
          `${WORKER_URL}/projects/${project.id}`,
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
          result?.error ||
            "Failed to delete project."
        );
      }

      console.log(
        "Project deleted:",
        result
      );

      if (onProjectDeleted) {
        await onProjectDeleted();
      }
    } catch (error) {
      console.error(
        "Project deletion error:",
        error
      );

      window.alert(
        error.message ||
          "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="relative w-full min-w-0 overflow-hidden rounded-[22px] border border-[#e0e1e8] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.06)] sm:rounded-[28px]">
      {/* Project image */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#f3f4f6] sm:aspect-[16/9]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : imageLoading ? (
          <div className="px-4 text-center text-[#9c9ea8]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#d8dbe3] border-t-[#4f6fe8]" />

            <p className="text-sm">
              Loading image...
            </p>
          </div>
        ) : imageError ? (
          <div className="px-4 text-center text-[#9c9ea8]">
            <ImagePlus
              className="mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12"
              strokeWidth={1.5}
            />

            <p className="text-sm">
              Unable to load image
            </p>
          </div>
        ) : (
          <ImagePlus
            className="h-10 w-10 text-[#b2b5bf] sm:h-12 sm:w-12"
            strokeWidth={1.5}
          />
        )}

        {/* Timeline badge */}
        <div className="absolute right-3 top-3 max-w-[calc(100%-24px)] rounded-xl bg-[#f1c17d] px-3 py-2 text-xs font-medium text-[#8a5a23] shadow-sm sm:right-5 sm:top-5 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-[16px]">
          <span className="break-words">
            {project.start_date} -{" "}
            {project.end_date}
          </span>
        </div>
      </div>

      {/* Project information */}
      <div className="p-4 sm:p-6">
        <h3 className="break-words text-lg font-semibold text-[#30323b] sm:text-xl">
          {project.title}
        </h3>

        <p className="mt-2 break-words text-sm leading-6 text-[#6d707b] sm:mt-3 sm:text-[16px] sm:leading-7">
          {project.description}
        </p>
      </div>

      {/* Admin delete button */}
      {currentUser?.role ===
        "admin" && (
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-white p-3 text-[#ff4e4e] shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:p-4"
            title={
              deleting
                ? "Deleting..."
                : "Delete project"
            }
          >
            <Trash2
              className={`h-5 w-5 ${
                deleting
                  ? "animate-pulse"
                  : ""
              }`}
              strokeWidth={2}
            />
          </button>
        </div>
      )}
    </article>
  );
}

// ----------------------------------------
// Projects Panel
// ----------------------------------------

export default function ProjectsPanel({
  projects = [],
  currentUser,
  onProjectCreated,
}) {
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8">
      <ProjectForm
        currentUser={currentUser}
        onProjectCreated={
          onProjectCreated
        }
      />

      {projects.length > 0 && (
        <div className="flex w-full min-w-0 justify-end">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-[#575a66] transition hover:bg-white"
          >
          </button>
        </div>
      )}

      <div className="w-full min-w-0 space-y-6 sm:space-y-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            currentUser={currentUser}
            onProjectDeleted={
              onProjectCreated
            }
          />
        ))}
      </div>
    </div>
  );
}
