'use client';

import Link from 'next/link';
import { useMemo, memo } from 'react';
import type { TooltipContentProps } from 'recharts';

import PostPreviewCard from '@/components/post/PostPreviewCard';
import type { Post } from '@/components/post/types';
import type { StackedPoint } from './types';
import { bandOf } from './bands';

function pickRepresentative(
  posts: Post[],
  avg: number,
  dayEmoji?: string,
): Post | undefined {
  if (!posts?.length) return undefined;
  return posts
    .map((p) => ({
      post: p,
      diff: Math.abs((p.intensity ?? 0) - avg),
      emojiPenalty: dayEmoji && p.emoji === dayEmoji ? 0 : 1,
      ts: new Date(p.createdAt).getTime(),
    }))
    .sort((a, b) => {
      if (a.diff !== b.diff) return a.diff - b.diff;
      if (a.emojiPenalty !== b.emojiPenalty)
        return a.emojiPenalty - b.emojiPenalty;
      return b.ts - a.ts;
    })[0]?.post;
}

type MiniPostTooltipProps = Omit<
  TooltipContentProps<number, string>,
  'payload' | 'label'
> & {
  postsByDay: Record<string, Post[]>;
  payload?: TooltipContentProps<number, string>['payload'];
  label?: TooltipContentProps<number, string>['label'];
};

function MiniPostTooltip(props: MiniPostTooltipProps) {
  const { active, payload, label, postsByDay } = props;

  const dayKey = label == null ? '' : String(label);

  const firstPayload =
    payload && payload.length > 0
      ? (payload[0].payload as StackedPoint | undefined)
      : undefined;
  const firstValue = firstPayload?.value;
  const firstEmoji = firstPayload?.emoji;

  const representative = useMemo(() => {
    if (firstValue == null || label == null) return undefined;
    const v = firstValue ?? 0;
    const posts = postsByDay[dayKey] ?? [];
    return pickRepresentative(posts, v, firstEmoji);
  }, [postsByDay, dayKey, firstValue, firstEmoji, label]);

  if (!active || !payload || payload.length === 0 || label == null) return null;

  const row = firstPayload as StackedPoint;
  const value = row?.value ?? 0;
  const emoji = row?.emoji ?? '🙂';
  const band = bandOf(value);

  return (
    <div className="pointer-events-auto w-80 max-w-[20rem] rounded-xl border border-gray-200 bg-white shadow-lg">
      {/* header */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="text-sm font-medium">{dayKey}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-base">{emoji}</span>
          <span className="tabular-nums">{value.toFixed(2)}%</span>
          <span
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
            style={{
              background: `${band.color}22`,
              border: `1px solid ${band.color}`,
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: band.color }}
            />
            {band.label}
          </span>
        </div>
      </div>

      {/* single post preview */}
      <div className="p-2">
        {representative ? (
          // <Link href={`/posts/${representative.id}`} className="block">
          // </Link>
          <PostPreviewCard post={representative} />
        ) : (
          <div className="px-2 py-3 text-xs text-gray-500">
            この日は投稿がありません。
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MiniPostTooltip);
