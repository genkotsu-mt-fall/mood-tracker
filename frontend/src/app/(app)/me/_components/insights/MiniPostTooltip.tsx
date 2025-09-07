"use client"; // Next.jsのクライアントコンポーネント宣言
import Link from "next/link";
import PostPreviewCard from "@/components/post/PostPreviewCard";
// 代表1件を選ぶ（平均値に近い→絵文字一致→新しい順）
function pickRepresentative(posts: Post[], avg: number, dayEmoji?: string) {
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
      if (a.emojiPenalty !== b.emojiPenalty) return a.emojiPenalty - b.emojiPenalty;
      return b.ts - a.ts;
    })[0]?.post;
}

// ...existing code...

// RechartsのTooltipが渡してくるpropsの型定義
import type { TooltipContentProps } from "recharts";
import type { Post } from "@/components/post/types";

// グラフで使う日別集計データの型（ムード値や絵文字など）
import type { StackedPoint } from "./types";

// ムード値から帯色やラベルを取得するユーティリティ関数
import { bandOf } from "./bands";



// RechartsのTooltipから渡されるprops（active, payload, labelなど）と、日付ごとの投稿リストを受け取る
type MiniPostTooltipProps = TooltipContentProps<number, string> & {
  postsByDay: Record<string, Post[]>;
};

export default function MiniPostTooltip(
  props: MiniPostTooltipProps
) {
  const { active, payload, label, postsByDay } = props;
  if (!active || !payload || !payload.length || label == null) return null;

  const row = payload[0].payload as StackedPoint;
  const v = row.value;
  const emo = row.emoji ?? "🙂";
  const band = bandOf(v);

  const posts = postsByDay[String(label)] ?? [];
  const representative = pickRepresentative(posts, v, row.emoji);

  return (
    <div className="pointer-events-auto w-80 max-w-[20rem] rounded-xl border border-gray-200 bg-white shadow-lg">
      {/* ヘッダ */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="font-medium text-sm">{label}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-base">{emo}</span>
          <span className="tabular-nums">{v.toFixed(2)}%</span>
          <span
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
            style={{ background: `${band.color}22`, border: `1px solid ${band.color}` }}
          >
            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: band.color }} />
            {band.label}
          </span>
        </div>
      </div>

      {/* 投稿プレビュー（1件だけ） */}
      <div className="p-2">
        {representative ? (
          <Link href={`/posts/${representative.id}`} className="block">
            <PostPreviewCard post={representative} />
          </Link>
        ) : (
          <div className="px-2 py-3 text-xs text-gray-500">この日は投稿がありません。</div>
        )}
      </div>
    </div>
  );
}
