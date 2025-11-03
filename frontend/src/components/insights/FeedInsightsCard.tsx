'use client';

import FeedInsightsChartRemote from '@/app/(app)/(feed)/_components/FeedInsightsChart.Remote';
// import { useEffect, useState } from 'react';
// import { makeSamplePosts } from '@/components/post/sample/samplePosts';
import type { Post } from '@/components/post/types';
// import FeedInsightsChart from './insights/FeedInsightsChart';
// import { useInsightsBandsPerPost } from '@/lib/insights/useInsightsBandsPerPost';

// const SAMPLE_POSTS: Post[] = makeSamplePosts('hp'); // フィード寄りのサンプル

type Props = { posts: Post[] };

export default function FeedInsightsCard({ posts }: Props) {
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => setMounted(true), []);

  // const { data, postsByDay } = useInsightsBandsPerPost(posts);

  return (
    <article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
      <div className="flex-1 min-h-0 h-full">
        <FeedInsightsChartRemote posts={posts ?? []} />
      </div>
    </article>
  );
}
