'use client';

import UserProfileRemote from '@/app/(app)/user/_components/UserProfile.Remote';
import UserInsightsCardRemote from '@/app/(app)/user/_components/InsightsCard.Remote';

export default function UserPageSection({ id }: { id: string }) {
  return (
    <div className="h-full min-h-0 flex flex-col gap-3">
      <UserProfileRemote id={id} />

      <div className="flex-1 min-h-0">
        <UserInsightsCardRemote id={id} />
      </div>
    </div>
  );
}
