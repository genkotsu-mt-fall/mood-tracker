'use client';

import { Post } from '@/components/post/types';
import { useMyPostOptions } from '@/lib/post/useMyPostOptions';
// import { PostResource } from '@genkotsu-mt-fall/shared/schemas';
import InsightsCard from './InsightsCard';
import { mapToUiPost } from '@/components/post/mapToUiPost';
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

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        あなたの投稿を読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        あなたの投稿の取得に失敗しました：{error.message}
      </div>
    );
  }

  const posts: Post[] = options.map(mapToUiPost);
  return <InsightsCard posts={posts} />;
}
