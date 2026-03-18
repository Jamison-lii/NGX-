import { ImagePlus, Paperclip, Smile } from "lucide-react";

export default function PostComposer() {
  return (
    <div className="rounded-[30px] border border-[#d9dbe3] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(17,24,39,0.04)]">
      <div className="flex items-start gap-3 text-[#8f929e]">
        <Paperclip className="mt-0.5 h-5 w-5" strokeWidth={1.8} />
        <textarea
          rows={4}
          placeholder="Message"
          className="min-h-[110px] w-full resize-none bg-transparent text-[18px] outline-none placeholder:text-[#8f929e]"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button className="flex items-center gap-2 rounded-full px-3 py-2 text-[#8f929e] transition hover:bg-[#f6f7fb] hover:text-[#4d5ec7]">
          <ImagePlus className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-sm font-medium">Media</span>
        </button>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-[#555966] transition hover:bg-[#f6f7fb]">
            <Smile className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <button className="rounded-full bg-[#4f6fe8] px-5 py-2.5 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da]">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}