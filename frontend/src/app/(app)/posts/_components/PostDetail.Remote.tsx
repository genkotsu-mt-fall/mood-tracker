'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { RemoteNotice } from '@/components/remote/RemoteNotice';
import { usePost } from '@/lib/post/usePost';
import PostDetailView from '@/components/post/PostDetail.View';

export default function PostDetailRemote({ id }: { id: string }) {
  const { post, isLoading, error } = usePost(id);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>投稿を読み込み中…</>}
      errorView={(e) => <>投稿の取得に失敗しました：{e.message}</>}
    >
      {!post ? (
        <RemoteNotice kind="info" className="rounded-md p-3">
          投稿が見つかりませんでした
        </RemoteNotice>
      ) : (
        <PostDetailView post={post} />
      )}
    </RemoteBoundary>
  );
}
