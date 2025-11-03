'use client';

import { usePost } from '@/lib/post/usePost';
import { mapToUiPost } from '@/components/post/mapToUiPost';
import PostDetail from '@/components/post/PostDetail';

export default function PostDetailRemote({ id }: { id: string }) {
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        投稿を読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        投稿の取得に失敗しました：{error.message}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="rounded-md border p-3 text-sm text-muted-foreground">
        投稿が見つかりませんでした
      </div>
    );
  }

  const uiPost = mapToUiPost(post);
  return <PostDetail post={uiPost} />;
}
