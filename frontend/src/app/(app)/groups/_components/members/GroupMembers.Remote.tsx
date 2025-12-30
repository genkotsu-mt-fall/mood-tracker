'use client';

import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useGroupMembers } from '@/lib/group/useGroupMembers';
import GroupMembersView from './GroupMembers.View';

const EMPTY: UserResource[] = [];

export default function GroupMembersRemote({ id }: { id: string }) {
  const { members, error, isLoading } = useGroupMembers(id);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      loading={<>メンバーを読み込み中…</>}
      errorView={(e) => <>メンバー一覧の取得に失敗しました：{e.message}</>}
    >
      <GroupMembersView baseMembers={members ?? EMPTY} />
    </RemoteBoundary>
  );
}
