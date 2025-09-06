"use client"

import { useEffect, useMemo, useState } from "react"
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip, CartesianGrid } from "recharts"
import { makeSamplePosts } from "@/components/post/sample/samplePosts"
import type { Post } from "@/components/post/types"

const SAMPLE_POSTS: Post[] = makeSamplePosts("insights")

type TinyPoint = { day: string; value: number }

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

	return (
			<article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
				<header className="mb-2 flex items-center gap-2 shrink-0">
					<div className="text-sm font-semibold text-gray-900">ムード（30日）</div>
					<div className="text-[11px] text-gray-500">0–100%</div>
				</header>

				<div className="flex-1 min-h-0">
					{mounted ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={last30} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
								{/* グリッド */}
								<CartesianGrid strokeDasharray="3 3" />

								{/* 縦軸：0–100%、コンパクト表示 */}
								<YAxis
									domain={[0, 100]}
									tick={{ fontSize: 11 }}
									tickFormatter={(v) => `${v}%`}
									ticks={[0, 20, 40, 60, 80, 100]}
									width={34}
								/>

								{/* 横軸：日付（MM-DD 表示、過密回避） */}
								<XAxis
									dataKey="day"
									tick={{ fontSize: 11 }}
									tickFormatter={(s: string) => s.slice(5)}
									minTickGap={18}
									tickMargin={6}
									allowDuplicatedCategory={false}
									interval="preserveStartEnd"
								/>

								<Tooltip
									formatter={(v: number) => [`${v}%`, "強度"]}
									labelFormatter={(l) => `日付: ${l}`}
								/>

								<Line
									type="monotone"
									dataKey="value"
									stroke="#2563EB"
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full rounded-lg bg-gray-100 animate-pulse" />
					)}
				</div>
			</article>
	)
}
