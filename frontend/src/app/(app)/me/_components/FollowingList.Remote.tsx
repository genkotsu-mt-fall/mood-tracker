'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyFollowingOptions } from '@/lib/user/useMyFollowingOptions';
import FollowingListView from './FollowingList.View';

export default function FollowingListRemote() {
  const { users, error, isLoading, mutate } = useMyFollowingOptions();

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      loading={<>フォロー中ユーザーを読み込み中…</>}
      errorView={(e) => (
        <>フォロー中ユーザーの取得に失敗しました：{e.message}</>
      )}
    >
      <FollowingListView users={users ?? []} mutate={mutate} />
    </RemoteBoundary>
  );
}
