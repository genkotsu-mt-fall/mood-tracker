"use client";

import FeedInsightsCard from "../_components/FeedInsightsCard";

export default function FollowingPage() {
  return (
    <div className="h-full overflow-auto -mx-4 md:-mx-6 -mt-4 md:-mt-6 lg:mx-0 lg:mt-0">
      <div className="h-full px-4 md:px-6 lg:px-0 pt-6 pb-0">
        <FeedInsightsCard />
      </div>
    </div>
  )
}
