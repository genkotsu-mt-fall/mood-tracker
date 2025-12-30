'use client';

import type { Post } from '@/components/post/types';
import { mapToUiPost } from '@/components/post/mapToUiPost';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyPostOptions } from '@/lib/post/useMyPostOptions';
import InsightsCard from './InsightsCard';
// import InsightsCard from './InsightsCard';

// function mapToUiPost(p: PostResource): Post {
//   return {
//     id: p.id,
//     author: {
//       name: p.author?.name ?? '（名前未設定）',
//       isMe: true,
//     },
//     createdAt:
//       typeof p.createdAt === 'string'
//         ? p.createdAt
//         : new Date(p.createdAt as unknown as string).toISOString(),
//     body: p.body,
//     emoji: p.emoji ?? undefined,
//     intensity: p.intensity ?? undefined,
//   };
// }

export default function InsightsCardRemote() {
  const { options, error, isLoading } = useMyPostOptions();

  const posts: Post[] = (options ?? []).map(mapToUiPost);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>あなたの投稿を読み込み中…</>}
      errorView={(e) => <>あなたの投稿の取得に失敗しました：{e.message}</>}
    >
      <InsightsCard posts={posts} />
    </RemoteBoundary>
  );
}
