import { PostResourceWithIsMe } from '@genkotsu-mt-fall/shared/schemas';
import { Post } from './types';

export function mapToUiPost(p: PostResourceWithIsMe): Post {
  const isMe = p.isMe;
  return {
    id: p.id,
    author: {
      id: p.author?.id, // 追加（shared schemaにある）
      name: p.author?.name ?? '（名前未設定）',
      // PostResource 側に avatarUrl が無いので現状は入れられない
      // avatarUrl: p.author?.avatarUrl,
      isMe,
    },
    createdAt:
      typeof p.createdAt === 'string'
        ? p.createdAt
        : new Date(p.createdAt).toISOString(),
    body: p.body,
    emoji: p.emoji ?? undefined,
    intensity: p.intensity ?? undefined,
  };
}
