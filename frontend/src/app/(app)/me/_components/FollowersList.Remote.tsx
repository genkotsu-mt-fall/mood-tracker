'use client';

import FollowersList, {
  FollowersListItem,
} from '@/components/user/FollowersList';
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

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        フォロワーを読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        フォロワー一覧の取得に失敗しました：{error.message}
      </div>
    );
  }

  const items: FollowersListItem[] = (users ?? []).map((u: UserResource) => ({
    id: u.id,
    name: toLabel(u),
    // スキーマに avatar 情報が無いので src は未指定
    src: undefined,
    subtitle: toSubtitle(u),
  }));

  return <FollowersList items={items} />;
}
