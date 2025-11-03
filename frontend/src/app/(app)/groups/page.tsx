'use client';

import GroupListRemote from './_components/GroupList.Remote';

export default function GroupsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">グループ</h1>
        <GroupListRemote />
      </div>
    </main>
  );
}
