'use client';

import FollowersListRemote from '../_components/FollowersList.Remote';

export default function MeFollowersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">フォロワー</h1>
        <FollowersListRemote />
      </div>
    </main>
  );
}
