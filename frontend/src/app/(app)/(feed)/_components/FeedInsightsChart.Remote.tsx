import { Post } from '@/components/post/types';
import { useInsightsBandsPerPost } from '@/lib/insights/useInsightsBandsPerPost';
import { useEffect, useState } from 'react';
import FeedInsightsChart from './insights/FeedInsightsChart';

type Props = { posts?: Post[] };

export default function FeedInsightsChartRemote({ posts = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, postsByDay } = useInsightsBandsPerPost(posts);

  if (!mounted) {
    return <div className={`h-full rounded-lg bg-gray-100 animate-pulse`} />;
  }

  return <FeedInsightsChart data={data} postsByDay={postsByDay} />;
}
