import { mapToUiPost } from '@/components/post/mapToUiPost';
import { Post } from '@/components/post/types';
import { usePostOptions } from '@/lib/post/usePostOptions';
import FeedInsightsCard from './FeedInsightsCard';

export default function FeedInsightsCardRemote() {
  const { options, error, isLoading } = usePostOptions();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        フィードの投稿を読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        フィードの取得に失敗しました：{error.message}
      </div>
    );
  }

  const posts: Post[] = options.map(mapToUiPost);
  return <FeedInsightsCard posts={posts} />;
}
