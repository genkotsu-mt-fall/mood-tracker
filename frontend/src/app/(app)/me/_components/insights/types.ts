// ← 追加：Scatter 用（1投稿 = 1点）
import type { Post } from "@/components/post/types";

export type PostPoint = {
  day: string; // YYYY-MM-DD
  value: number; // intensity 0-100
  emoji?: string;
  post: Post;
};
export type TinyPoint = { day: string; value: number; emoji?: string };

export type StackedPoint = TinyPoint & {
  b0_15: number;
  b15_30: number;
  b30_50: number;
  b50_75: number;
  b75_100: number;
};

export type Band = { low: number; high: number; color: string; label: string };
