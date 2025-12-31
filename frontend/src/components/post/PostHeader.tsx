'use client';

import { formatRelative } from './utils';
import PostHeaderUI from './PostHeader.UI';

export function PostHeader({
  authorId,
  isMe,
  name,
  avatarUrl,
  createdAt,
  emoji,
  intensity,
}: {
  authorId?: string;
  isMe: boolean;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  emoji?: string;
  intensity?: number;
}) {
  const createdAtLabel = formatRelative(createdAt);
  const authorHref = isMe ? '/me' : authorId ? `/users/${authorId}` : undefined;

  return (
    <PostHeaderUI
      name={name}
      avatarUrl={avatarUrl}
      createdAtLabel={createdAtLabel}
      emoji={emoji}
      intensity={intensity}
      authorHref={authorHref}
      ariaLabel={isMe ? 'マイページへ' : `${name}のユーザーページへ`}
    />
  );
}
