import FeedInsightsCard from '@/components/insights/FeedInsightsCard';
import { mapToUiPost } from '@/components/post/mapToUiPost';
import { Post } from '@/components/post/types';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { usePostOptions } from '@/lib/post/usePostOptions';

export default function FeedInsightsCardRemote() {
  const { options, error, isLoading } = usePostOptions();

  const posts: Post[] = (options ?? []).map(mapToUiPost);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>フィードの投稿を読み込み中…</>}
      errorView={(e) => <>フィードの取得に失敗しました：{e.message}</>}
    >
      <FeedInsightsCard posts={posts} />
    </RemoteBoundary>
  );
}
