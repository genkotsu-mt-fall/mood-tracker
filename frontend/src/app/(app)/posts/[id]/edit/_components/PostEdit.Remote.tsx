'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { RemoteNotice } from '@/components/remote/RemoteNotice';
import { usePost } from '@/lib/post/usePost';
import PostEditComposer from './PostEditComposer';

export default function PostEditRemote({ id }: { id: string }) {
  const { post, isLoading, error } = usePost(id);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md"
      loading={<>投稿を読み込み中…</>}
      errorView={(e) => <>投稿の取得に失敗しました：{e.message}</>}
    >
      {!post ? (
        <RemoteNotice kind="info" className="rounded-md p-3">
          投稿が見つかりませんでした
        </RemoteNotice>
      ) : (
        <PostEditComposer id={id} post={post} />
      )}
    </RemoteBoundary>
  );
}
