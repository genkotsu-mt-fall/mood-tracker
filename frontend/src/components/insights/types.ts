import type { Post } from '@/components/post/types';

export type TinyPoint = {
  id: string;
  xLabel: string;
  day: string;
  value: number;
  emoji?: string;
};

export type StackedPoint = TinyPoint & {
  b0_15: number;
  b15_30: number;
  b30_50: number;
  b50_75: number;
  b75_100: number;
};

export type PostPoint = {
  day: string;
  value: number;
  emoji?: string;
  post: Post;
};

export type Band = { low: number; high: number; color: string; label: string };
