
import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function PostCard({
  post,
  canUpdate,
  canDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const createdDate = new Date(post.created_at);

  // Get the author's profile information
  const authorName =
    post.profiles?.full_name || "Community Member";

  const authorRole =
    post.profiles?.role === "admin"
      ? "Community Admin"
      : "Community Member";

  const avatarLetter = authorName.charAt(0).toUpperCase();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
      return;
    }

    console.log("Post deleted successfully");
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      alert("Post cannot be empty.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("posts")
      .update({
        content: editContent.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id);

    if (error) {
      console.error("Error updating post:", error);
      alert(error.message);
      setSaving(false);
      return;
    }

    setIsEditing(false);
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  return (
    <article className="rounded-[24px] border border-[#d2d4da] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26272d] text-[22px] text-white">
            {avatarLetter}
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-[#22242b]">
              {authorName}
            </h3>

            <p className="text-[15px] italic text-[#8c8d96]">
              {authorRole}
            </p>
          </div>
        </div>

        {(canUpdate || canDelete) && (
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full p-2 text-[#5d616d] transition hover:bg-[#f4f6fb]"
                    title="Edit post"
                  >
                    <Pencil
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full p-2 text-[#ff4e4e] transition hover:bg-[#fff2f2]"
                    title="Delete post"
                  >
                    <Trash2
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={saving}
                  className="rounded-full p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                  title="Save changes"
                >
                  <Check
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="rounded-full p-2 text-[#ff4e4e] transition hover:bg-[#fff2f2] disabled:opacity-50"
                  title="Cancel edit"
                >
                  <X
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={5}
          className="mt-5 w-full resize-none rounded-[16px] border border-[#d9dbe3] bg-[#fafafa] p-4 text-[17px] leading-7 text-[#60626d] outline-none focus:border-[#4f6fe8]"
          autoFocus
        />
      ) : (
        <p className="mt-5 text-[17px] leading-7 text-[#60626d]">
          {post.content}
        </p>
      )}

      {post.image_url && (
        <div className="mt-5 overflow-hidden rounded-[18px]">
          <img
            src={post.image_url}
            alt="Post media"
            className="h-[330px] w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 text-right text-[15px] text-[#aaaaaf]">
        {createdDate.toLocaleDateString()}
      </div>
    </article>
  );
}

