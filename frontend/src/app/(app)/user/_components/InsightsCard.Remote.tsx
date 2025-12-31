'use client';

import type { Post } from '@/components/post/types';
import { mapToUiPost } from '@/components/post/mapToUiPost';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import InsightsCard from '@/components/insights/InsightsCard';
import { useUserPostOptions } from '@/lib/user/useUserPostOptions';

export default function UserInsightsCardRemote({ id }: { id: string }) {
  const { data, error, isLoading } = useUserPostOptions(id);

  const posts: Post[] = (data ?? []).map(mapToUiPost);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>投稿を読み込み中…</>}
      errorView={(e) => <>投稿の取得に失敗しました：{e.message}</>}
    >
      <InsightsCard posts={posts} />
    </RemoteBoundary>
  );
}
