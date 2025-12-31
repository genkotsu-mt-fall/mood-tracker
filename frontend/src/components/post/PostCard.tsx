'use client';

import type { Post } from './types';
import { useExpand, useLike, useReactions } from './hooks';
import PostCardUI from './PostCard.UI';

export default function PostCard({
  post,
  compact = false,
}: {
  post: Post;
  compact?: boolean;
}) {
  const { expanded, toggle: toggleExpand } = useExpand(180);
  const {
    liked,
    count: likeCount,
    toggle: toggleLike,
  } = useLike(post.likes ?? 0);
  const { reactions, myReactions, total, toggleEmoji } = useReactions();

  return (
    <PostCardUI
      post={post}
      compact={compact}
      expanded={expanded}
      onToggleExpand={toggleExpand}
      liked={liked}
      likeCount={likeCount}
      onToggleLike={toggleLike}
      reactions={reactions}
      myReactions={myReactions}
      total={total}
      onToggleEmoji={toggleEmoji}
    />
  );
}
