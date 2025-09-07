"use client";
import { useMemo } from "react";
import type { Post } from "@/components/post/types";
import { dayKey } from "./date";
import { bandHeight, clamp100 } from "./bands";
import type { TinyPoint, StackedPoint, PostPoint } from "./types";

export function useInsightsData(posts: Post[]) {
  // 1回の走査で：日別平均 + 絵文字 + 日別投稿
  const { tinyData, postsByDay } = useMemo(() => {
    const m = new Map<
      string,
      { sum: number; count: number; date: Date; emoji?: string; posts: Post[] }
    >();
    for (const p of posts) {
      const d = new Date(p.createdAt);
      const key = dayKey(d);
      const v = clamp100(p.intensity);
      const rec = m.get(key);
      if (rec) {
        rec.sum += v;
        rec.count += 1;
        rec.posts.push(p);
        if (!rec.emoji && p.emoji) rec.emoji = p.emoji;
      } else {
        m.set(key, {
          sum: v,
          count: 1,
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          emoji: p.emoji,
          posts: [p],
        });
      }
    }
    const rows: TinyPoint[] = Array.from(m.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((r) => ({
        day: dayKey(r.date),
        value: +(r.sum / r.count).toFixed(2),
        emoji: r.emoji ?? "🙂",
      }));
    const pb: Record<string, Post[]> = {};
    for (const [k, v] of m) pb[k] = v.posts;
    return { tinyData: rows, postsByDay: pb };
  }, [posts]);

  const last30 = tinyData.length > 30 ? tinyData.slice(-30) : tinyData;

  const data: StackedPoint[] = useMemo(
    () =>
      last30.map((p) => ({
        ...p,
        b0_15: bandHeight(p.value, 0, 15),
        b15_30: bandHeight(p.value, 15, 30),
        b30_50: bandHeight(p.value, 30, 50),
        b50_75: bandHeight(p.value, 50, 75),
        b75_100: bandHeight(p.value, 75, 100),
      })),
    [last30]
  );

  // ★ 追加：last30 に含まれる日の投稿だけを点にする
  const daysSet = useMemo(() => new Set(last30.map((d) => d.day)), [last30]);
  const postPoints: PostPoint[] = useMemo(
    () =>
      posts
        .filter((p) => daysSet.has(dayKey(new Date(p.createdAt))))
        .map((p) => ({
          day: dayKey(new Date(p.createdAt)),
          value: clamp100(p.intensity),
          emoji: p.emoji,
          post: p,
        })),
    [posts, daysSet]
  );

  return { data, postsByDay, postPoints };
}
