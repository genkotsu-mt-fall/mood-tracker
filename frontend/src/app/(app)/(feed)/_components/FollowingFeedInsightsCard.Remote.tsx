import { mapToUiPost } from '@/components/post/mapToUiPost';
import { Post } from '@/components/post/types';
import FeedInsightsCard from './FeedInsightsCard';
import { useFollowingPostOptions } from '@/lib/post/useFollowingPostOptions';

export default function FollowingFeedInsightsCardRemote() {
  const { options, error, isLoading } = useFollowingPostOptions();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        フォロー中の投稿を読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        フォロー中フィードの取得に失敗しました：{error.message}
      </div>
    );
  }

  const posts: Post[] = options.map(mapToUiPost);
  return <FeedInsightsCard posts={posts} />;
}
