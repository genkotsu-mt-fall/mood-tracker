'use client';

import FollowersList, {
  type FollowersListItem,
} from '@/components/user/FollowersList';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyFollowersOptions } from '@/lib/user/useMyFollowersOptions';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';

function toLabel(u: UserResource): string {
  // name が無い場合は email をラベルとして使用
  return u.name ?? u.email;
}

function toSubtitle(u: UserResource): string | undefined {
  // 最低限の補助情報として email を表示（name と同一なら省略してもOKだが、ここでは常に表示）
  return u.email;
}

export default function FollowersListRemote() {
  const { users, error, isLoading } = useMyFollowersOptions();

  const items: FollowersListItem[] = (users ?? []).map((u: UserResource) => ({
    id: u.id,
    name: toLabel(u),
    // スキーマに avatar 情報が無いので src は未指定
    src: undefined,
    subtitle: toSubtitle(u),
  }));

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      loading={<>フォロワーを読み込み中…</>}
      errorView={(e) => <>フォロワー一覧の取得に失敗しました：{e.message}</>}
    >
      <FollowersList items={items} />
    </RemoteBoundary>
  );
}
