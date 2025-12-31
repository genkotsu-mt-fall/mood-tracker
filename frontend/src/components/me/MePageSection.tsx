'use client';

import MeProfileRemote from '@/app/(app)/me/_components/MeProfile.Remote';
import InsightsCardRemote from '@/components/insights/InsightsCard.Remote';

export default function MePageSection() {
  return (
    <div className="h-full min-h-0 flex flex-col gap-3">
      <MeProfileRemote />
      <div className="flex-1 min-h-0">
        <InsightsCardRemote />
      </div>
    </div>
  );
}
