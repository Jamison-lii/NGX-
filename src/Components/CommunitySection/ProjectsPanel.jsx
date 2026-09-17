
import {
  CalendarDays,
  ChevronDown,
  ImagePlus,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

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
    <section className="overflow-hidden rounded-[30px] border border-[#d7d9e0] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.05)]">
      <label
        htmlFor="project-image"
        className="block cursor-pointer"
      >
        <div className="flex min-h-[310px] items-center justify-center bg-[#f3f4f6] transition hover:bg-[#eef0f3]">
          {preview ? (
            <img
              src={preview}
              alt="Project preview"
              className="h-[310px] w-full object-cover"
            />
          ) : (
            <div className="text-center text-[#9c9ea8]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4d7df] bg-white/60">
                <ImagePlus
                  className="h-10 w-10"
                  strokeWidth={1.7}
                />
              </div>

              <p className="text-lg tracking-[0.2em]">
                •••
              </p>

              <p className="mt-2 italic text-[#4e68c8]">
                Drop
              </p>

              <p className="mt-2 text-sm text-[#9c9ea8]">
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

      <div className="space-y-6 px-7 py-7 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-[16px] font-medium text-[#9fa2ad]">
              Title
            </span>

            <div className="flex items-center gap-3 border-b border-[#d3d5dc] pb-3">
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Enter project title"
                className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#b2b5bf]"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-3 block text-[16px] font-medium text-[#9fa2ad]">
              Timeline
            </span>

            <div className="flex items-center gap-3 border-b border-[#d3d5dc] pb-3">
              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                className="w-full bg-transparent text-[16px] outline-none"
              />

              <span className="text-sm text-[#9a9ca5]">
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
                className="w-full bg-transparent text-[16px] outline-none"
              />

              <ChevronDown className="h-5 w-5 shrink-0 text-[#9a9ca5]" />
            </div>
          </label>
        </div>

        <label className="block">
          <span className="mb-3 block text-[16px] font-medium text-[#9fa2ad]">
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
            className="w-full rounded-[24px] border border-[#d7d9e0] bg-[#fcfcfd] px-5 py-4 text-[16px] outline-none placeholder:text-[#b2b5bf] focus:border-[#b5c1f7]"
          />
        </label>

        {file && (
          <p className="text-sm text-[#6d707b]">
            Selected image:{" "}
            {file.name}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            {success}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={posting}
            className="rounded-full border border-[#61636c] px-8 py-2.5 text-[16px] font-medium text-[#61636c] transition hover:bg-[#f7f7f8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={posting}
            className="inline-flex items-center gap-2 rounded-full bg-[#4f6fe8] px-8 py-2.5 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da] disabled:cursor-not-allowed disabled:opacity-50"
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
    <article
      className="relative overflow-hidden rounded-[28px] border border-[#e0e1e8] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.06)]"
    >
      <div className="flex h-[430px] w-full items-center justify-center overflow-hidden bg-[#f3f4f6]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : imageLoading ? (
          <div className="text-center text-[#9c9ea8]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#d8dbe3] border-t-[#4f6fe8]" />

            <p className="text-sm">
              Loading image...
            </p>
          </div>
        ) : imageError ? (
          <div className="text-center text-[#9c9ea8]">
            <ImagePlus
              className="mx-auto mb-3 h-12 w-12"
              strokeWidth={1.5}
            />

            <p className="text-sm">
              Unable to load image
            </p>
          </div>
        ) : (
          <ImagePlus
            className="h-12 w-12 text-[#b2b5bf]"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="absolute right-5 top-5 rounded-2xl bg-[#f1c17d] px-4 py-2.5 text-[16px] font-medium text-[#8a5a23] shadow-sm">
        {project.start_date} -{" "}
        {project.end_date}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#30323b]">
          {project.title}
        </h3>

        <p className="mt-3 text-[16px] leading-7 text-[#6d707b]">
          {project.description}
        </p>
      </div>

      {currentUser?.role ===
        "admin" && (
        <div className="absolute bottom-5 right-5 flex flex-col gap-3">
        {/*  <button
            type="button"
            className="rounded-2xl bg-white p-4 text-[#585b67] shadow-lg transition hover:scale-[1.02]"
          >
            <Pencil
              className="h-5 w-5"
              strokeWidth={2}
            />
          </button>*/} 

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-2xl bg-white p-4 text-[#ff4e4e] shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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
    <div className="space-y-8">
      <ProjectForm
        currentUser={currentUser}
        onProjectCreated={
          onProjectCreated
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-[#575a66] transition hover:bg-white"
        >
         
        </button>
      </div>

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
  );
}

