'use client';
import { useMemo } from 'react';
import type { Post } from '@/components/post/types';
import { dayKey } from './date';
import { StackedPoint } from '@/components/insights/types';
import { bandHeight, clamp100 } from '@/components/insights/bands';

export function useInsightsBandsPerPost(posts: Post[]) {
  // 日別一覧は従来通り（右ペインやツールチップで使う）
  const postsByDay: Record<string, Post[]> = useMemo(() => {
    const m = new Map<string, Post[]>();
    for (const p of posts) {
      const k = dayKey(new Date(p.createdAt));
      const arr = m.get(k);
      if (arr) arr.push(p);
      else m.set(k, [p]);
    }
    const rec: Record<string, Post[]> = {};
    for (const [k, v] of m) rec[k] = v;
    return rec;
  }, [posts]);

  // 直近30「投稿日」に絞る（従来の表示範囲のままにしたい場合）
  const allDays = useMemo(() => Object.keys(postsByDay).sort(), [postsByDay]);
  const last30Days = useMemo(
    () => (allDays.length > 30 ? allDays.slice(-30) : allDays),
    [allDays],
  );
  const daysSet = useMemo(() => new Set(last30Days), [last30Days]);

  // ★ 平均せず、各投稿を 5帯に分解して1レコード化（StackedPoint と同じ形）
  const data: StackedPoint[] = useMemo(() => {
    // 1) 日→時刻の順に安定ソート（重要）
    const filtered = posts
      .filter((p) => daysSet.has(dayKey(new Date(p.createdAt))))
      .slice()
      .sort((a, b) => {
        const da = dayKey(new Date(a.createdAt));
        const db = dayKey(new Date(b.createdAt));
        if (da !== db) return da.localeCompare(db);
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

    // 2) 同一日の中で連番を振ってユニークID化
    const perDayCounter = new Map<string, number>();

    const rows = filtered.map((p) => {
      const raw = Number(p.intensity);
      const v = Number.isFinite(raw) ? clamp100(raw) : 0;
      const day = dayKey(new Date(p.createdAt));

      const n = (perDayCounter.get(day) ?? 0) + 1;
      perDayCounter.set(day, n);
      const id = `${day}#${n - 1}`; // 0始まり

      return {
        id,
        xLabel: day,
        day, // 同じ日付が複数回出てOK（重要）
        value: v,
        emoji: p.emoji ?? '🙂',
        b0_15: bandHeight(v, 0, 15),
        b15_30: bandHeight(v, 15, 30),
        b30_50: bandHeight(v, 30, 50),
        b50_75: bandHeight(v, 50, 75),
        b75_100: bandHeight(v, 75, 100),
      } as StackedPoint;
    });

    // どれか一つでも非数値なら除外
    const good = rows.filter(
      (d) =>
        Number.isFinite(d.value) &&
        Number.isFinite(d.b0_15) &&
        Number.isFinite(d.b15_30) &&
        Number.isFinite(d.b30_50) &&
        Number.isFinite(d.b50_75) &&
        Number.isFinite(d.b75_100),
    );

    return good;
  }, [posts, daysSet]);

  return { data, postsByDay };
}
