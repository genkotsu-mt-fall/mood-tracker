"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
	ResponsiveContainer,
	ComposedChart,
	Area,
	Line,
	YAxis,
	XAxis,
	Tooltip,
	CartesianGrid,
} from "recharts"
import type { TooltipProps } from "recharts"
import { makeSamplePosts } from "@/components/post/sample/samplePosts"
import type { Post } from "@/components/post/types"

const SAMPLE_POSTS: Post[] = makeSamplePosts("insights")


	type TinyPoint = { day: string; value: number; emoji?: string };

type StackedPoint = TinyPoint & {
};

const BANDS = [
	{ low: 0,  high: 15,  color: "#2563EB", label: "0–15%"  },
	{ low: 15, high: 30,  color: "#93C5FD", label: "15–30%" },
	{ low: 30, high: 50,  color: "#FACC15", label: "30–50%" },
	{ low: 50, high: 75,  color: "#FB923C", label: "50–75%" },
	{ low: 75, high: 100, color: "#F87171", label: "75–100%"},
]
function bandOf(v: number) {
	return BANDS.find(b => v >= b.low && v < b.high) ?? BANDS[BANDS.length - 1]
}
// 絵文字ドット
function EmojiDot({ cx = 0, cy = 0, payload }: { cx?: number; cy?: number; payload?: StackedPoint }) {
	const em = payload?.emoji ?? "🙂"
	return (
		<text x={cx} y={cy} fontSize={20} textAnchor="middle" dy="0.35em">
			{em}
		</text>
	)
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: StackedPoint }>;
  label?: string;
  postsByDay: Record<string, Post[]>;
};

// ミニ投稿カード風ツールチップ
function MiniPostTooltip(props: CustomTooltipProps) {
  const { active, payload, label, postsByDay } = props;
  if (!active || !payload || !payload.length || !label) return null;

  const row = payload[0].payload as StackedPoint;
  const v = row.value;
  const emo = row.emoji ?? "🙂";
  const band = bandOf(v);
  const posts = postsByDay[label] ?? [];

  return (
		<div className="pointer-events-auto w-80 max-w-[20rem] rounded-xl border border-gray-200 bg-white shadow-lg">
			{/* ヘッダ：日付・値・帯 */}
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

			{/* 投稿リスト（最大3件） */}
			<div className="max-h-64 overflow-auto divide-y divide-gray-100">
				{posts.slice(0, 3).map((p: Post) => (
					<Link
						key={p.id}
						href={`/posts/${p.id}`}
						className="block px-3 py-2 hover:bg-gray-50"
					>
						<div className="flex items-center gap-1 text-sm font-medium text-gray-900">
							<span>{p.author.name}</span>
							{p.emoji && <span>{p.emoji}</span>}
						</div>
						<p className="text-xs text-gray-600 line-clamp-2">{p.body}</p>
						<div className="mt-1 flex gap-3 text-[11px] text-gray-500">
							<span>❤ {p.likes}</span>
							<span>💬 {p.comments}</span>
							<span>🔁 {p.reposts}</span>
						</div>
					</Link>
				))}
				{posts.length > 3 && (
					<div className="px-3 py-2 text-xs text-gray-500">他 {posts.length - 3} 件…</div>
				)}
				{posts.length === 0 && (
					<div className="px-3 py-4 text-xs text-gray-500">この日は投稿がありません。</div>
				)}
			</div>
		</div>
	);
}

function dayKey(d: Date) {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, "0")
	const dd = String(d.getDate()).padStart(2, "0")
	return `${y}-${m}-${dd}`
}

function clamp100(x: unknown) {
	const n = typeof x === "number" ? x : 0
	return Math.max(0, Math.min(100, n))
}
// 値 v が [low, high) の帯にどれだけ含まれるか（高さ）
function bandHeight(v: number, low: number, high: number) {
	const vv = clamp100(v);
	return Math.max(0, Math.min(vv, high) - low);
}

export default function InsightsCard() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	// 1回の走査で集計 + 日別投稿リストを構築
	const { tinyData, postsByDay } = useMemo(() => {
		const m = new Map<string, { sum: number; count: number; date: Date; emoji?: string; posts: Post[] }>()
		for (const p of SAMPLE_POSTS) {
			const d = new Date(p.createdAt)
			const key = dayKey(d)
			const v = clamp100(p.intensity)
			const rec = m.get(key)
			if (rec) {
				rec.sum += v
				rec.count += 1
				rec.posts.push(p)
				if (!rec.emoji && p.emoji) rec.emoji = p.emoji
			} else {
				m.set(key, {
					sum: v,
					count: 1,
					date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
					emoji: p.emoji,
					posts: [p],
				})
			}
		}
		const rows = Array.from(m.values())
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.map((r) => ({
				day: dayKey(r.date),
				value: +(r.sum / r.count).toFixed(2),
				emoji: r.emoji ?? "🙂",
			}))
		const pb: Record<string, Post[]> = {}
		for (const [k, v] of m) pb[k] = v.posts
		return { tinyData: rows, postsByDay: pb }
	}, [])

	const last30 = tinyData.length > 30 ? tinyData.slice(-30) : tinyData

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
	)

	return (
		<article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
			<header className="mb-2 flex items-center gap-2 shrink-0">
				<div className="text-sm font-semibold text-gray-900">ムード（30日・帯色）</div>
				<div className="text-[11px] text-gray-500">0–100%</div>
			</header>

			<div className="flex-1 min-h-0">
				{mounted ? (
					<ResponsiveContainer width="100%" height="100%">
						<ComposedChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<YAxis
								domain={[0, 100]}
								ticks={[0, 15, 30, 50, 75, 100]}
								tick={{ fontSize: 11 }}
								tickFormatter={(v) => `${v}%`}
								width={36}
							/>
							<XAxis
								dataKey="day"
								tick={{ fontSize: 11 }}
								tickFormatter={(s: string) => s.slice(5)}
								minTickGap={18}
								tickMargin={6}
								allowDuplicatedCategory={false}
								interval="preserveStartEnd"
							/>

							{/* 帯塗り分け */}
							<Area type="monotone" dataKey="b0_15"   stackId="v" stroke="none" fill="#2563EB" />
							<Area type="monotone" dataKey="b15_30"  stackId="v" stroke="none" fill="#93C5FD" />
							<Area type="monotone" dataKey="b30_50"  stackId="v" stroke="none" fill="#FACC15" />
							<Area type="monotone" dataKey="b50_75"  stackId="v" stroke="none" fill="#FB923C" />
							<Area type="monotone" dataKey="b75_100" stackId="v" stroke="none" fill="#F87171" />

							{/* 合計ライン + 絵文字ドット */}
							<Line
								type="monotone"
								dataKey="value"
								stroke="#111827"
								strokeWidth={2}
								isAnimationActive={false}
								dot={<EmojiDot />}
								activeDot={false}
							/>

							{/* 投稿カード風ツールチップ */}
							<Tooltip
								content={<MiniPostTooltip postsByDay={postsByDay} />}
								wrapperStyle={{ pointerEvents: "auto" }}
								// Recharts v2.5+ ならはみ出し許可が使えます。古い場合は削ってOK
								allowEscapeViewBox={{ x: true, y: true } as Partial<{ x: boolean; y: boolean }>}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				) : (
					<div className="h-full rounded-lg bg-gray-100 animate-pulse" />
				)}
			</div>
		</article>
	)
}
