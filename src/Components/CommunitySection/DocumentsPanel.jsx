import { useState } from "react";
import { FileText, Lock, Upload, X } from "lucide-react";

export default function DocumentsPanel({ documents = [] }) {
  const [documentList, setDocumentList] = useState(documents);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.file) {
      alert("Please fill in title, description, and choose a file.");
      return;
    }

    const newDocument = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      fileName: formData.file.name,
      file: formData.file,
    };

    setDocumentList((prev) => [newDocument, ...prev]);

    setFormData({
      title: "",
      description: "",
      type: "PDF",
      file: null,
    });

    const fileInput = document.getElementById("documentFile");
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = (id) => {
    setDocumentList((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#26262d]">
          Documents
        </h1>
        <p className="mt-2 text-[17px] text-[#7d808b]">
          Private files uploaded by the community lead.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="rounded-[24px] border border-[#d2d4da] bg-white p-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]"
      >
        <h2 className="mb-5 text-xl font-semibold text-[#26262d]">
          Upload Document
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#5d616d]">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter document title"
              className="w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 outline-none focus:border-[#4f6fe8]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5d616d]">
              Document Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 outline-none focus:border-[#4f6fe8]"
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="PPTX">PPTX</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#5d616d]">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter document description"
            className="w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 outline-none focus:border-[#4f6fe8]"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#5d616d]">
            Upload File
          </label>
          <input
            id="documentFile"
            type="file"
            name="file"
            onChange={handleChange}
            className="block w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 text-sm"
          />
          {formData.file && (
            <p className="mt-2 text-sm text-[#6a6d77]">
              Selected file: {formData.file.name}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#4f6fe8] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da]"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </form>

      <div className="space-y-5">
        {documentList.map((document) => (
          <article
            key={document.id}
            className="flex items-start justify-between gap-4 rounded-[24px] border border-[#d2d4da] bg-white p-5 shadow-[0_18px_42px_rgba(17,24,39,0.05)]"
          >
            <div className="flex gap-4">
              <div className="rounded-2xl bg-[#edf1ff] p-3 text-[#4f6fe8]">
                <FileText className="h-6 w-6" strokeWidth={1.9} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#26262d]">
                  {document.title}
                </h3>
                <p className="mt-1 text-[#717481]">{document.description}</p>

                {document.fileName && (
                  <p className="mt-2 text-sm text-[#8b8f99]">
                    File: {document.fileName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#f5f6f8] px-4 py-2 text-sm font-medium text-[#6a6d77]">
                <Lock className="h-4 w-4" strokeWidth={2} />
                {document.type}
              </div>

              <button
                onClick={() => handleDelete(document.id)}
                className="rounded-full p-2 text-[#ff4e4e] transition hover:bg-[#fff2f2]"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}