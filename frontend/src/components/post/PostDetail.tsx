'use client';

import PostCard from './PostCard';
import type { Post } from './types';

export default function PostDetail({ post }: { post: Post }) {
  return (
    <>
      <PostCard post={post} />
      <section className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600">
        <p>ここにコメント一覧／操作（編集・削除: 所有者のみ）を後で追加</p>
      </section>
    </>
  );
}
