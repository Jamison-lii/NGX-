import { Pencil, Trash2 } from "lucide-react";

export default function PostCard({ post }) {
  return (
    <article className="rounded-[24px] border border-[#d2d4da] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26272d] text-[22px] text-white">
            {post.avatarLetter}
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-[#22242b]">
              {post.author}
            </h3>
            <p className="text-[15px] italic text-[#8c8d96]">{post.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-[#5d616d] transition hover:bg-[#f4f6fb]">
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button className="rounded-full p-2 text-[#ff4e4e] transition hover:bg-[#fff2f2]">
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <p className="mt-5 text-[17px] leading-7 text-[#60626d]">
        {post.content}
      </p>

      {post.image && (
        <div className="mt-5 overflow-hidden rounded-[18px]">
          <img
            src={post.image}
            alt="Post media"
            className="h-[330px] w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 text-right text-[15px] text-[#aaaaaf]">
        {post.createdAt}
      </div>
    </article>
  );
}