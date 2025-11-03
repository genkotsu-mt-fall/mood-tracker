'use client';

import FollowingList, {
  FollowingListItem,
} from '@/components/user/FollowingList';
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

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        フォロー中ユーザーを読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        フォロー中ユーザーの取得に失敗しました：{error.message}
      </div>
    );
  }

  const items: FollowingListItem[] = (users ?? []).map((u: UserResource) => ({
    id: u.id,
    name: toLabel(u),
    // スキーマに avatar が無いので未指定
    src: undefined,
    subtitle: toSubtitle(u),
  }));

  return <FollowingList items={items} />;
}
