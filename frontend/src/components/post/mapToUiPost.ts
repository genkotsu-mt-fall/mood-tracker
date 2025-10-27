import { PostResource } from '@genkotsu-mt-fall/shared/schemas';
import { Post } from './types';

export function mapToUiPost(p: PostResource): Post {
  return {
    id: p.id,
    author: {
      name: p.author?.name ?? '（名前未設定）',
      isMe: false,
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
