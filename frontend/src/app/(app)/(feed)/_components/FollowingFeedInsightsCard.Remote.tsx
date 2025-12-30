import FeedInsightsCard from '@/components/insights/FeedInsightsCard';
import { mapToUiPost } from '@/components/post/mapToUiPost';
import { Post } from '@/components/post/types';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useFollowingPostOptions } from '@/lib/post/useFollowingPostOptions';

export default function FollowingFeedInsightsCardRemote() {
  const { options, error, isLoading } = useFollowingPostOptions();

  const posts: Post[] = (options ?? []).map(mapToUiPost);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>フォロー中の投稿を読み込み中…</>}
      errorView={(e) => (
        <>フォロー中フィードの取得に失敗しました：{e.message}</>
      )}
    >
      <FeedInsightsCard posts={posts} />
    </RemoteBoundary>
  );
}
