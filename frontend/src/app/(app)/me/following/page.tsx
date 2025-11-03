'use client';

import FollowingListRemote from '../_components/FollowingList.Remote';

export default function MeFollowingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">フォロー中</h1>
        <FollowingListRemote />
      </div>
    </main>
  );
}
