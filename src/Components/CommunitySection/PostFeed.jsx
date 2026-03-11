import PostCard from "./PostCard";

export default function PostFeed({ posts }) {
  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}