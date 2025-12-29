'use client';

import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { useGroupMembers } from '@/lib/group/useGroupMembers';
import GroupMembersView from './GroupMembers.View';

const EMPTY: UserResource[] = [];

export default function GroupMembersRemote({ id }: { id: string }) {
  const { members, error, isLoading } = useGroupMembers(id);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        メンバーを読み込み中…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        メンバー一覧の取得に失敗しました：{error.message}
      </div>
    );
  }

  return <GroupMembersView baseMembers={members ?? EMPTY} />;
}
