'use client';

import GroupMembersRemote from '@/app/(app)/groups/_components/members/GroupMembers.Remote';

export default function GroupMembersSection({ id }: { id: string }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-3">
      <h2 className="mb-2 text-sm font-semibold text-gray-900">メンバー</h2>
      <GroupMembersRemote id={id} />
    </section>
  );
}
