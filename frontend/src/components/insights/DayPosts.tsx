'use client';

import { memo } from 'react';
import PostCard from '@/components/post/PostCard';
import type { Post } from '@/components/post/types';

type Props = {
  day: string;
  posts?: Post[];
  /** 右パネルで余白や高さを調整したいとき用（任意） */
  className?: string;
};

function DayPosts({ day, posts = [], className }: Props) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-gray-500" aria-live="polite">
        {day} の投稿はありません。
      </p>
    );
  }

  return (
    <div
      className={className ? `space-y-3 ${className}` : 'space-y-3'}
      role="list"
      aria-label={`${day} の投稿一覧`}
    >
      {posts.map((p) => (
        <div role="listitem" key={p.id}>
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}

export default memo(DayPosts);
