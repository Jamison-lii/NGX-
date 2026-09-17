
import { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Lock,
  File,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export default function DocumentsPanel({
  documents = [],
  loading = false,
  currentUser,
  onDocumentUploaded,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isConfidential, setIsConfidential] =
    useState(false);
  const [uploading, setUploading] = useState(false);

  // ----------------------------------------
  // Access management state
  // ----------------------------------------

  const [accessDocument, setAccessDocument] =
    useState(null);

  const [members, setMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] =
    useState([]);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [savingAccess, setSavingAccess] =
    useState(false);

  const isAdmin = currentUser?.role === "admin";

  // ----------------------------------------
  // File selection
  // ----------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    if (!title.trim()) {
      setTitle(
        file.name.replace(/\.[^/.]+$/, "")
      );
    }
  };

  // ----------------------------------------
  // Download document
  // ----------------------------------------

  const handleDownload = async (document) => {
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
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(
        `${WORKER_URL}/download/${document.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.error ||
            "Unable to download document."
        );
      }

      const blob = await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = downloadUrl;
      link.download = document.file_name;

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(
        "Document download error:",
        error
      );

      alert(
        error.message ||
          "Unable to download document."
      );
    }
  };

  // ----------------------------------------
  // Reset upload form
  // ----------------------------------------

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setIsConfidential(false);

    const fileInput =
      document.getElementById(
        "document-file-input"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ----------------------------------------
  // Upload document
  // ----------------------------------------

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a document title.");
      return;
    }

    if (!currentUser?.id) {
      alert("You must be logged in.");
      return;
    }

    if (!isAdmin) {
      alert(
        "Only administrators can upload documents."
      );
      return;
    }

    if (
      selectedFile.size >
      50 * 1024 * 1024
    ) {
      alert(
        "File is too large. Maximum size is 50 MB."
      );
      return;
    }

    setUploading(true);

    try {
      // --------------------------------
      // Get current Supabase session
      // --------------------------------

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
          "Your session has expired. Please log in again."
        );
      }

      // --------------------------------
      // Upload file to Cloudflare Worker
      // --------------------------------

      const response = await fetch(
        `${WORKER_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-File-Name": selectedFile.name,
            "Content-Type":
              selectedFile.type ||
              "application/octet-stream",
          },
          body: selectedFile,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to upload file."
        );
      }

      console.log(
        "R2 upload successful:",
        result
      );

      // --------------------------------
      // Save metadata in Supabase
      // --------------------------------

      const {
        data: document,
        error: documentError,
      } = await supabase
        .from("documents")
        .insert({
          title: title.trim(),
          description:
            description.trim() || null,
          file_name: result.fileName,
          file_key: result.fileKey,
          file_type: result.contentType,
          file_size: selectedFile.size,
          is_confidential: isConfidential,
          uploaded_by: currentUser.id,
        })
        .select()
        .single();

      if (documentError) {
        console.error(
          "Document metadata error:",
          documentError
        );

        throw new Error(
          "File uploaded to storage, but saving document information failed."
        );
      }

      console.log(
        "Document saved successfully:",
        document
      );

      alert(
        "Document uploaded successfully."
      );

      resetForm();

      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (error) {
      console.error(
        "Document upload error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while uploading the document."
      );
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------------
  // Format file size
  // ----------------------------------------

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  // ----------------------------------------
  // Get file icon
  // ----------------------------------------

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return (
        <FileText className="h-5 w-5" />
      );
    }

    return (
      <File className="h-5 w-5" />
    );
  };

  // ----------------------------------------
  // Open access manager
  // ----------------------------------------

  const handleManageAccess = async (
    document
  ) => {
    if (!isAdmin) {
      return;
    }

    setAccessDocument(document);
    setMembers([]);
    setSelectedMemberIds([]);
    setLoadingMembers(true);

    try {
      // --------------------------------
      // Get active community members
      // --------------------------------

      const {
        data: memberData,
        error: memberError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, role, is_active"
        )
        .eq("role", "member")
        .eq("is_active", true)
        .order("full_name", {
          ascending: true,
        });

      if (memberError) {
        throw memberError;
      }

      // --------------------------------
      // Get existing access
      // --------------------------------

      const {
        data: accessData,
        error: accessError,
      } = await supabase
        .from("document_access")
        .select("user_id")
        .eq(
          "document_id",
          document.id
        );

      if (accessError) {
        throw accessError;
      }

      setMembers(memberData || []);

      setSelectedMemberIds(
        (accessData || []).map(
          (access) => access.user_id
        )
      );
    } catch (error) {
      console.error(
        "Error loading document access:",
        error
      );

      alert(
        error.message ||
          "Unable to load document access."
      );

      setAccessDocument(null);
    } finally {
      setLoadingMembers(false);
    }
  };

  // ----------------------------------------
  // Toggle member access
  // ----------------------------------------

  const handleToggleMember = (
    memberId
  ) => {
    setSelectedMemberIds(
      (currentIds) => {
        if (currentIds.includes(memberId)) {
          return currentIds.filter(
            (id) => id !== memberId
          );
        }

        return [
          ...currentIds,
          memberId,
        ];
      }
    );
  };

  // ----------------------------------------
  // Save document access
  // ----------------------------------------

  const handleSaveAccess = async () => {
    if (!accessDocument) {
      return;
    }

    setSavingAccess(true);

    try {
      // --------------------------------
      // Remove existing access
      // --------------------------------

      const {
        error: deleteError,
      } = await supabase
        .from("document_access")
        .delete()
        .eq(
          "document_id",
          accessDocument.id
        );

      if (deleteError) {
        throw deleteError;
      }

      // --------------------------------
      // Add selected access
      // --------------------------------

      if (selectedMemberIds.length > 0) {
        const accessRows =
          selectedMemberIds.map(
            (userId) => ({
              document_id:
                accessDocument.id,
              user_id: userId,
            })
          );

        const {
          error: insertError,
        } = await supabase
          .from("document_access")
          .insert(accessRows);

        if (insertError) {
          throw insertError;
        }
      }

      alert(
        "Document access updated successfully."
      );

      setAccessDocument(null);
    } catch (error) {
      console.error(
        "Error saving document access:",
        error
      );

      alert(
        error.message ||
          "Unable to update document access."
      );
    } finally {
      setSavingAccess(false);
    }
  };

  // ----------------------------------------
  // Select all members
  // ----------------------------------------

  const handleSelectAll = () => {
    setSelectedMemberIds(
      members.map((member) => member.id)
    );
  };

  // ----------------------------------------
  // Clear all members
  // ----------------------------------------

  const handleClearAll = () => {
    setSelectedMemberIds([]);
  };

  return (
    <div className="space-y-6">
      {/* -------------------------------- */}
      {/* Admin upload section */}
      {/* -------------------------------- */}

      {isAdmin && (
        <div className="rounded-[24px] border border-[#d2d4da] bg-white p-5 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
          <div className="mb-5">
            <h3 className="text-[20px] font-semibold text-[#22242b]">
              Upload Document
            </h3>

            <p className="mt-1 text-[14px] text-[#8c8d96]">
              Upload a document for the
              community.
            </p>
          </div>

          {/* File */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#444650]">
              File
            </label>

            <label
              htmlFor="document-file-input"
              className="flex cursor-pointer items-center gap-3 rounded-[16px] border border-dashed border-[#cfd2db] bg-[#fafbfc] px-4 py-4 transition hover:border-[#4f6fe8] hover:bg-[#f7f8ff]"
            >
              <Upload className="h-5 w-5 text-[#4f6fe8]" />

              <div className="min-w-0 flex-1">
                {selectedFile ? (
                  <>
                    <p className="truncate text-sm font-medium text-[#30323a]">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-[#8c8d96]">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#8c8d96]">
                    Click to choose a file
                  </p>
                )}
              </div>
            </label>

            <input
              id="document-file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Title */}

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#444650]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Document title"
              className="w-full rounded-[14px] border border-[#d9dbe3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4f6fe8]"
            />
          </div>

          {/* Description */}

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#444650]">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Optional description"
              className="w-full resize-none rounded-[14px] border border-[#d9dbe3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4f6fe8]"
            />
          </div>

          {/* Confidential */}

          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(e) =>
                setIsConfidential(
                  e.target.checked
                )
              }
              className="h-4 w-4 rounded"
            />

            <div>
              <p className="text-sm font-medium text-[#444650]">
                Confidential document
              </p>

              <p className="text-xs text-[#8c8d96]">
                Access can be restricted to
                selected members.
              </p>
            </div>
          </label>

          {/* Upload button */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#4f6fe8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />

            {uploading
              ? "Uploading..."
              : "Upload document"}
          </button>
        </div>
      )}

      {/* -------------------------------- */}
      {/* Documents list */}
      {/* -------------------------------- */}

      <div>
        <div className="mb-4">
          <h3 className="text-[20px] font-semibold text-[#22242b]">
            Documents
          </h3>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#d2d4da] bg-white px-5 py-10 text-center text-[#8c8d96]">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-[24px] border border-[#d2d4da] bg-white px-5 py-10 text-center text-[#8c8d96]">
            No documents available.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(
              (document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between gap-4 rounded-[20px] border border-[#d2d4da] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(17,24,39,0.04)]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f3f5fb] text-[#4f6fe8]">
                      {getFileIcon(
                        document.file_type
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-[16px] font-semibold text-[#292b32]">
                          {document.title}
                        </h4>

                        {document.is_confidential && (
                          <Lock className="h-4 w-4 shrink-0 text-[#8c8d96]" />
                        )}
                      </div>

                      {document.description && (
                        <p className="mt-1 truncate text-sm text-[#8c8d96]">
                          {
                            document.description
                          }
                        </p>
                      )}

                      <p className="mt-1 text-xs text-[#a0a1a9]">
                        {
                          document.file_name
                        }{" "}
                        ·{" "}
                        {formatFileSize(
                          document.file_size
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {/* Manage access */}

                    {isAdmin &&
                      document.is_confidential && (
                        <button
                          type="button"
                          onClick={() =>
                            handleManageAccess(
                              document
                            )
                          }
                          className="flex items-center gap-2 rounded-full border border-[#d9dbe3] px-4 py-2 text-sm font-medium text-[#555966] transition hover:border-[#4f6fe8] hover:text-[#4f6fe8]"
                        >
                          <Users className="h-4 w-4" />
                          Manage Access
                        </button>
                      )}

                    {/* Download */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          document
                        )
                      }
                      className="flex items-center gap-2 rounded-full border border-[#d9dbe3] px-4 py-2 text-sm font-medium text-[#555966] transition hover:border-[#4f6fe8] hover:text-[#4f6fe8]"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Access management modal */}
      {/* -------------------------------- */}

      {accessDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-[24px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
            {/* Modal header */}

            <div className="flex items-start justify-between border-b border-[#ececf0] px-6 py-5">
              <div>
                <h3 className="text-[20px] font-semibold text-[#22242b]">
                  Manage Document Access
                </h3>

                <p className="mt-1 text-sm text-[#8c8d96]">
                  {accessDocument.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAccessDocument(null)
                }
                disabled={savingAccess}
                className="rounded-full p-2 text-[#8c8d96] transition hover:bg-[#f5f6f9] hover:text-[#33353d] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}

            <div className="px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#33353d]">
                    Select members
                  </p>

                  <p className="mt-1 text-xs text-[#8c8d96]">
                    Only selected members will
                    be able to download this
                    confidential document.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={
                      loadingMembers ||
                      savingAccess
                    }
                    className="text-xs font-medium text-[#4f6fe8] hover:underline disabled:opacity-50"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={
                      loadingMembers ||
                      savingAccess
                    }
                    className="text-xs font-medium text-[#8c8d96] hover:underline disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {loadingMembers ? (
                <div className="rounded-[16px] border border-[#e2e3e8] px-4 py-8 text-center text-sm text-[#8c8d96]">
                  Loading members...
                </div>
              ) : members.length === 0 ? (
                <div className="rounded-[16px] border border-[#e2e3e8] px-4 py-8 text-center text-sm text-[#8c8d96]">
                  No active members found.
                </div>
              ) : (
                <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {members.map(
                    (member) => {
                      const selected =
                        selectedMemberIds.includes(
                          member.id
                        );

                      return (
                        <label
                          key={member.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition ${
                            selected
                              ? "border-[#4f6fe8] bg-[#f7f8ff]"
                              : "border-[#e2e3e8] hover:bg-[#fafbfc]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              selected
                            }
                            onChange={() =>
                              handleToggleMember(
                                member.id
                              )
                            }
                            className="h-4 w-4 rounded"
                          />

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#26272d] text-sm font-medium text-white">
                            {member.full_name
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                              "M"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#33353d]">
                              {
                                member.full_name
                              }
                            </p>

                            <p className="text-xs text-[#8c8d96]">
                              Community Member
                            </p>
                          </div>
                        </label>
                      );
                    }
                  )}
                </div>
              )}

              {/* Selection count */}

              {!loadingMembers &&
                members.length > 0 && (
                  <p className="mt-4 text-xs text-[#8c8d96]">
                    {selectedMemberIds.length}{" "}
                    member
                    {selectedMemberIds.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                )}
            </div>

            {/* Modal footer */}

            <div className="flex items-center justify-end gap-3 border-t border-[#ececf0] px-6 py-5">
              <button
                type="button"
                onClick={() =>
                  setAccessDocument(null)
                }
                disabled={savingAccess}
                className="rounded-full border border-[#d9dbe3] px-5 py-2.5 text-sm font-medium text-[#555966] transition hover:bg-[#f7f8fa] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAccess}
                disabled={
                  loadingMembers ||
                  savingAccess
                }
                className="rounded-full bg-[#4f6fe8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.24)] transition hover:bg-[#4463da] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingAccess
                  ? "Saving..."
                  : "Save Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

