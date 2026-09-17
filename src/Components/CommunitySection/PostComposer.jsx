
import { useState } from "react";
import { ImagePlus, Paperclip, Smile } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../Context/AuthContext";

export default function PostComposer({ onPostCreated }) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const canCreate =
    user?.role === "admin" ||
    user?.permissions?.canCreatePosts === true;

  const handlePost = async () => {
    if (!content.trim()) {
      alert("Please write something before posting.");
      return;
    }

    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    if (!canCreate) {
      alert("You don't have permission to create posts.");
      return;
    }

    setPosting(true);

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: content.trim(),
    });

    if (error) {
      console.error("Error creating post:", error);
      alert(error.message);
      setPosting(false);
      return;
    }

    setContent("");
    setPosting(false);

    console.log("Post created - refreshing feed");

    if (onPostCreated) {
      onPostCreated();
    }

    alert("Post created successfully.");
  };

  if (!canCreate) {
    return null;
  }

  return (
    <div className="rounded-[30px] border border-[#d9dbe3] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(17,24,39,0.04)]">
      <div className="flex items-start gap-3 text-[#8f929e]">
        <Paperclip className="mt-0.5 h-5 w-5" strokeWidth={1.8} />

        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message"
          className="min-h-[110px] w-full resize-none bg-transparent text-[18px] outline-none placeholder:text-[#8f929e]"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-[#8f929e] transition hover:bg-[#f6f7fb] hover:text-[#4d5ec7]"
        >
          <ImagePlus
            className="h-5 w-5"
            strokeWidth={1.8}
          />

          <span className="text-sm font-medium">
            Media
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-[#555966] transition hover:bg-[#f6f7fb]"
          >
            <Smile
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            onClick={handlePost}
            disabled={posting}
            className="rounded-full bg-[#4f6fe8] px-5 py-2.5 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(79,111,232,0.28)] transition hover:bg-[#4463da] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

