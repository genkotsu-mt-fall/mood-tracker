'use client';

import GroupTitleCard from '@/components/group/GroupTitleCard';
import { useGroupOptions } from '@/lib/group/useGroup';

export default function GroupTitleCardRemote({ id }: { id: string }) {
  const { data, error, isLoading } = useGroupOptions(id);

  if (isLoading) {
    return (
      <div className="animate-pulse mb-4 rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        グループを読み込み中…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        グループ情報の取得に失敗しました：{error?.message ?? 'unknown error'}
      </div>
    );
  }

  return <GroupTitleCard name={data.name} />;
}
