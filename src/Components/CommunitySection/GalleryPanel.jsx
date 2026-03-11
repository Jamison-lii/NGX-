import { useState } from "react";
import { ImagePlus, Play, Trash2, Upload } from "lucide-react";

export default function GalleryPanel({ items = [] }) {
  const [galleryItems, setGalleryItems] = useState(items);
  const [formData, setFormData] = useState({
    title: "",
    type: "image",
    file: null,
    preview: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const selectedFile = files[0];

      if (!selectedFile) return;

      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
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

    if (!formData.title || !formData.file) {
      alert("Please add a title and choose a file.");
      return;
    }

    const newItem = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      src: formData.preview,
      file: formData.file,
      fileName: formData.file.name,
    };

    setGalleryItems((prev) => [newItem, ...prev]);

    setFormData({
      title: "",
      type: "image",
      file: null,
      preview: "",
    });

    const fileInput = document.getElementById("galleryFile");
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#26262d]">
          Gallery
        </h1>
        <p className="mt-2 text-[17px] text-[#7d808b]">
          Images and videos shared by the community lead.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="rounded-[26px] border border-[#d7d9e0] bg-white p-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]"
      >
        <h2 className="mb-5 text-xl font-semibold text-[#26262d]">
          Upload Media
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
              placeholder="Enter media title"
              className="w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 outline-none focus:border-[#4f6fe8]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5d616d]">
              Media Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 outline-none focus:border-[#4f6fe8]"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#5d616d]">
            Upload File
          </label>
          <input
            id="galleryFile"
            type="file"
            name="file"
            accept="image/*,video/*"
            onChange={handleChange}
            className="block w-full rounded-2xl border border-[#d7d9e0] px-4 py-3 text-sm"
          />
        </div>

        {formData.preview && (
          <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e3e4e8] bg-[#f8f8fa] p-3">
            {formData.type === "image" ? (
              <img
                src={formData.preview}
                alt="Preview"
                className="h-[220px] w-full rounded-[16px] object-cover"
              />
            ) : (
              <video
                src={formData.preview}
                controls
                className="h-[220px] w-full rounded-[16px] object-cover"
              />
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#4f6fe8] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da]"
          >
            <Upload className="h-4 w-4" />
            Upload Media
          </button>
        </div>
      </form>

      <div className="grid gap-5 md:grid-cols-2">
        {galleryItems.map((item) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-[26px] border border-[#d7d9e0] bg-white shadow-[0_18px_42px_rgba(17,24,39,0.05)]"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.title}
                className="h-[290px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <video
                src={item.src}
                className="h-[290px] w-full object-cover"
                controls
              />
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-5">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-white/80">
                  {item.type}
                  {item.fileName ? ` • ${item.fileName}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {item.type === "video" && (
                  <button
                    type="button"
                    className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm"
                  >
                    <Play
                      className="h-5 w-5 fill-white text-white"
                      strokeWidth={2}
                    />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-white p-3 text-[#ff4e4e] shadow-md"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-[#d7d9e0] bg-white p-10 text-center text-[#8a8d97]">
          <div className="mb-3 flex justify-center">
            <ImagePlus className="h-8 w-8" />
          </div>
          <p>No gallery items uploaded yet.</p>
        </div>
      )}
    </div>
  );
}

