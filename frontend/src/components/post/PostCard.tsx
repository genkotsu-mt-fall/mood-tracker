'use client';

import { useRouter } from 'next/navigation';
import { deletePostClient } from '@/lib/post/client';
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
  const router = useRouter();

  const { expanded, toggle: toggleExpand } = useExpand(180);
  const {
    liked,
    count: likeCount,
    toggle: toggleLike,
  } = useLike(post.likes ?? 0);
  const { reactions, myReactions, total, toggleEmoji } = useReactions();

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    const ok = window.confirm('この投稿を削除します。よろしいですか？');
    if (!ok) return;

    try {
      await deletePostClient(post.id);
      // 表示中の一覧/詳細を確実に更新するため、/feed にハード遷移
      window.location.assign('/feed');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '投稿の削除に失敗しました。';
      alert(msg);
    }
  };

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
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
