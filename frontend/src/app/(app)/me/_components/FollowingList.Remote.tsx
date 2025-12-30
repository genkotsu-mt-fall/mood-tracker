'use client';

import FollowingList, {
  type FollowingListItem,
} from '@/components/user/FollowingList';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyFollowingOptions } from '@/lib/user/useMyFollowingOptions';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';

function toLabel(u: UserResource): string {
  // name が無い場合は email をラベルとして使用
  return u.name ?? u.email;
}

function toSubtitle(u: UserResource): string | undefined {
  // 補助情報として email を表示
  return u.email;
}

export default function FollowingListRemote() {
  const { users, error, isLoading } = useMyFollowingOptions();

  const items: FollowingListItem[] = (users ?? []).map((u: UserResource) => ({
    id: u.id,
    name: toLabel(u),
    // スキーマに avatar が無いので未指定
    src: undefined,
    subtitle: toSubtitle(u),
  }));

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      loading={<>フォロー中ユーザーを読み込み中…</>}
      errorView={(e) => (
        <>フォロー中ユーザーの取得に失敗しました：{e.message}</>
      )}
    >
      <FollowingList items={items} />
    </RemoteBoundary>
  );
}
