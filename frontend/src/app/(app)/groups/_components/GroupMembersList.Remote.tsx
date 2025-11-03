'use client';

import GroupMembersList, {
  type GroupMemberItem,
} from '@/components/group/GroupMembersList';
import { useGroupMembers } from '@/lib/group/useGroupMembers';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';

function toLabel(u: UserResource): string {
  return u.name ?? u.email;
}
function toSubtitle(u: UserResource): string | undefined {
  return u.email;
}

export default function GroupMembersListRemote({ id }: { id: string }) {
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

  const items: GroupMemberItem[] = (members ?? []).map((u) => ({
    id: u.id,
    name: toLabel(u),
    src: undefined, // Avatar URLはスキーマに無いので未設定
    subtitle: toSubtitle(u),
  }));

  return <GroupMembersList items={items} />;
}
