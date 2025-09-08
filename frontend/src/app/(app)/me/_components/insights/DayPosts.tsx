"use client";
import PostCard from "@/components/post/PostCard";
import type { Post } from "@/components/post/types";

export default function DayPosts({ day, posts }: { day: string; posts: Post[] }) {
  if (!posts?.length) {
    return <p className="text-sm text-gray-500">{day} の投稿はありません。</p>;
  }
  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
