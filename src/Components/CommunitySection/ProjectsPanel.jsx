import {
  CalendarDays,
  ChevronDown,
  ImagePlus,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

function Field({ label, placeholder, icon }) {
  return (
    <label className="block">
      <span className="mb-3 block text-[16px] font-medium text-[#9fa2ad]">
        {label}
      </span>
      <div className="flex items-center gap-3 border-b border-[#d3d5dc] pb-3">
        <input
          placeholder={placeholder}
          className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#b2b5bf]"
        />
        {icon}
      </div>
    </label>
  );
}

function ProjectForm() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#d7d9e0] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.05)]">
      <div className="flex min-h-[310px] items-center justify-center bg-[#f3f4f6]">
        <div className="text-center text-[#9c9ea8]">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4d7df] bg-white/60">
            <ImagePlus className="h-10 w-10" strokeWidth={1.7} />
          </div>
          <p className="text-lg tracking-[0.2em]">•••</p>
          <p className="mt-2 italic text-[#4e68c8]">Drop</p>
        </div>
      </div>

      <div className="space-y-6 px-7 py-7 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Title" placeholder="Enter project title" />
          <Field
            label="Timeline"
            placeholder="Choose date range"
            icon={<ChevronDown className="h-5 w-5 text-[#9a9ca5]" />}
          />
        </div>

        <label className="block">
          <span className="mb-3 block text-[16px] font-medium text-[#9fa2ad]">
            Description
          </span>
          <textarea
            rows={4}
            placeholder="Write project description"
            className="w-full rounded-[24px] border border-[#d7d9e0] bg-[#fcfcfd] px-5 py-4 text-[16px] outline-none placeholder:text-[#b2b5bf] focus:border-[#b5c1f7]"
          />
        </label>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button className="rounded-full border border-[#61636c] px-8 py-2.5 text-[16px] font-medium text-[#61636c] transition hover:bg-[#f7f7f8]">
            Cancel
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#4f6fe8] px-8 py-2.5 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da]">
            <CalendarDays className="h-4 w-4" strokeWidth={2} />
            Post
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPanel({ projects }) {
  return (
    <div className="space-y-8">
      <ProjectForm />

      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-full px-3 py-2 text-[#575a66] transition hover:bg-white">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          <span className="text-[16px] font-medium">Filter</span>
        </button>
      </div>

      {projects.map((project) => (
        <article
          key={project.id}
          className="relative overflow-hidden rounded-[28px] border border-[#e0e1e8] bg-white shadow-[0_20px_45px_rgba(17,24,39,0.06)]"
        >
          <img
            src={project.image}
            alt={project.title}
            className="h-[430px] w-full object-cover"
          />

          <div className="absolute right-5 top-5 rounded-2xl bg-[#f1c17d] px-4 py-2.5 text-[16px] font-medium text-[#8a5a23] shadow-sm">
            {project.date}
          </div>

          <div className="absolute bottom-5 right-5 flex flex-col gap-3">
            <button className="rounded-2xl bg-white p-4 text-[#585b67] shadow-lg transition hover:scale-[1.02]">
              <Pencil className="h-5 w-5" strokeWidth={2} />
            </button>
            <button className="rounded-2xl bg-white p-4 text-[#ff4e4e] shadow-lg transition hover:scale-[1.02]">
              <Trash2 className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}