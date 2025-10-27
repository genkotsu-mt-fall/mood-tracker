'use client';
import { useEffect, useState } from 'react';
import type { Post } from '@/components/post/types';
import InsightsChart from './InsightsChart';
import { useInsightsBandsPerPost } from '@/lib/insights/useInsightsBandsPerPost';

type Props = { posts?: Post[]; className?: string };

export default function InsightsChartRemote({ posts = [], className }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, postsByDay } = useInsightsBandsPerPost(posts);

  if (!mounted) {
    return (
      <div
        className={`h-full rounded-lg bg-gray-100 animate-pulse ${className ?? ''}`}
      />
    );
  }

  return (
    <InsightsChart className={className} data={data} postsByDay={postsByDay} />
  );
}
