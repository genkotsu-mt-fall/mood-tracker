'use client';

import GroupList, { GroupListItem } from '@/components/group/GroupList';
import { useGroupOptions } from '@/lib/group/useGroupOptions';

export default function GroupListRemote() {
  const { options, error, isLoading } = useGroupOptions();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        グループを読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        グループ一覧の取得に失敗しました：{error.message}
      </div>
    );
  }

  // useGroupOptions は { id, label } を返す想定
  const items: GroupListItem[] = options.map((o) => ({
    id: o.id,
    name: o.label,
    // 人数情報はスキーマに無いので省略（あれば here で count を付与）
  }));

  return <GroupList items={items} />;
}
