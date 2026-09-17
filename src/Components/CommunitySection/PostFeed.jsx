
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../Context/AuthContext";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`*, profiles:author_id (full_name, role)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      return;
    }

    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          console.log("Post change received:", payload);

          if (payload.eventType === "INSERT") {
            fetchPosts();
          }

          if (payload.eventType === "UPDATE") {
            fetchPosts();
          }

          if (payload.eventType === "DELETE") {
            setPosts((currentPosts) =>
              currentPosts.filter(
                (post) => post.id !== payload.old.id
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Posts realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="py-6 text-center text-[#8c8d96]">
        Loading posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#d2d4da] bg-white px-5 py-10 text-center text-[#8c8d96]">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => {
        const isAdmin = user?.role === "admin";
        const isAuthor = post.author_id === user?.id;

        const canUpdate =
          isAdmin ||
          (isAuthor &&
            user?.permissions?.canUpdatePosts === true);

        const canDelete =
          isAdmin ||
          (isAuthor &&
            user?.permissions?.canDeletePosts === true);

        return (
          <PostCard
            key={post.id}
            post={post}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        );
      })}
    </div>
  );
}

