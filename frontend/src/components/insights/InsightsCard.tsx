'use client';

import type { Post } from '@/components/post/types';
import InsightsChartRemote from '@/components/insights/InsightsChart.Remote';

type Props = { posts?: Post[] };

export default function InsightsCard({ posts }: Props) {
  return (
    <article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
      <div className="flex-1 min-h-0 h-full">
        <InsightsChartRemote
          className="h-full min-h-[12rem]"
          posts={posts ?? []}
        />
      </div>
    </article>
  );
}
