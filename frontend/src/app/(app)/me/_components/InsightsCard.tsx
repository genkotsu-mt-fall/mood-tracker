"use client"

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
import { makeSamplePosts } from "@/components/post/sample/samplePosts"
import type { Post } from "@/components/post/types"

const SAMPLE_POSTS: Post[] = makeSamplePosts("insights")


type TinyPoint = { day: string; value: number }
type StackedPoint = TinyPoint & {
	b0_15: number
	b15_30: number
	b30_50: number
	b50_75: number
	b75_100: number
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
	const vv = clamp100(v)
	return Math.max(0, Math.min(vv, high) - low)
}

export default function InsightsCard() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	// SAMPLE_POSTS を日単位で平均化（0-100）
	const tinyData = useMemo<TinyPoint[]>(() => {
		const map = new Map<string, { sum: number; count: number; date: Date }>()
		for (const p of SAMPLE_POSTS) {
			const d = new Date(p.createdAt)
			const key = dayKey(d)
			const v = clamp100(p.intensity)
			const rec = map.get(key)
			if (rec) {
				rec.sum += v
				rec.count += 1
			} else {
				map.set(key, { sum: v, count: 1, date: new Date(d.getFullYear(), d.getMonth(), d.getDate()) })
			}
		}
		return Array.from(map.values())
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.map((r) => ({ day: dayKey(r.date), value: +(r.sum / r.count).toFixed(2) }))
	}, [])


		const last30 = tinyData.length > 30 ? tinyData.slice(-30) : tinyData

		// 帯ごとの積み上げデータ
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
									tickFormatter={(s: string) => s.slice(5)} // "YYYY-MM-DD" → "MM-DD"
									minTickGap={18}
									tickMargin={6}
									allowDuplicatedCategory={false}
									interval="preserveStartEnd"
								/>

								{/* 帯の塗り分け（同じ stackId で積む） */}
								<Area type="monotone" dataKey="b0_15"   stackId="v" stroke="none" fill="#2563EB" />
								<Area type="monotone" dataKey="b15_30"  stackId="v" stroke="none" fill="#93C5FD" />
								<Area type="monotone" dataKey="b30_50"  stackId="v" stroke="none" fill="#FACC15" />
								<Area type="monotone" dataKey="b50_75"  stackId="v" stroke="none" fill="#FB923C" />
								<Area type="monotone" dataKey="b75_100" stackId="v" stroke="none" fill="#F87171" />

								{/* 合計のラインを重ねる */}
								<Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} dot={false} isAnimationActive={false} />

								{/* ツールチップ（合計値のみ表示） */}
								<Tooltip
									content={({ label, payload }) => {
										const total = payload?.find((p) => p.dataKey === "value")?.value as number | undefined
										return (
											<div className="rounded-md border bg-white px-2 py-1 text-xs">
												<div>日付: {label}</div>
												{typeof total === "number" && <div>強度: {total.toFixed(2)}%</div>}
											</div>
										)
									}}
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
