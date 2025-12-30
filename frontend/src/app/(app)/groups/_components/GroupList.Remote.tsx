'use client';

import GroupList, { GroupListItem } from '@/components/group/GroupList';
import GroupListView from '@/components/group/GroupList.View';
import { useGroupOptions } from '@/lib/group/useGroupOptions';
import { deleteGroupClient } from '@/lib/group/client';

export default function GroupListRemote() {
  const { options, error, isLoading, mutate } = useGroupOptions();

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

  const items: GroupListItem[] = options.map((o) => ({
    id: o.id,
    name: o.label,
  }));

  return (
    <GroupListView
      onDelete={async (groupId) => {
        await deleteGroupClient(groupId);
        await mutate();
      }}
    >
      {(deleteApi) => <GroupList items={items} deleteApi={deleteApi} />}
    </GroupListView>
  );
}
