'use client';

import GroupList, { type GroupListItem } from '@/components/group/GroupList';
import GroupListView from '@/components/group/GroupList.View';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useGroupOptions } from '@/lib/group/useGroupOptions';
import { deleteGroupClient } from '@/lib/group/client';

export default function GroupListRemote() {
  const { options, error, isLoading, mutate } = useGroupOptions();

  const items: GroupListItem[] = (options ?? []).map((o) => ({
    id: o.id,
    name: o.label,
  }));

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      loading={<>グループを読み込み中…</>}
      errorView={(e) => <>グループ一覧の取得に失敗しました：{e.message}</>}
    >
      <GroupListView
        onDelete={async (groupId) => {
          await deleteGroupClient(groupId);
          await mutate();
        }}
      >
        {(deleteApi) => <GroupList items={items} deleteApi={deleteApi} />}
      </GroupListView>
    </RemoteBoundary>
  );
}
