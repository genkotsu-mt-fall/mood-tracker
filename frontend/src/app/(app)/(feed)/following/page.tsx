'use client';

import FollowingFeedInsightsCardRemote from '../_components/FollowingFeedInsightsCard.Remote';

export default function FollowingFeedPage() {
  return (
    // 親 layout の p-4/md:p-6 を相殺して、/me と同じ見え方に寄せる
    <div className="h-full overflow-auto -mx-4 md:-mx-6 -mt-4 md:-mt-6 lg:mx-0 lg:mt-0">
      <div className="h-full px-4 md:px-6 lg:px-0 pt-6 pb-0">
        <FollowingFeedInsightsCardRemote />
      </div>
    </div>
  );
}
