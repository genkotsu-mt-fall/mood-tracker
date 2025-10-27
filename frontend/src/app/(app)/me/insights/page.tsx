// 'use client'

// import { useMemo, useState, useEffect } from 'react'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   ReferenceArea,
//   CartesianGrid,
//   Scatter,
// } from 'recharts'
// import { makeSamplePosts } from '@/components/post/sample/samplePosts'

// type Range = 7 | 30 | 90 | 'all'

// const SAMPLE_POSTS = makeSamplePosts('insights')

// /** YYYY-MM-DD */
// function dayKey(d: Date) {
//   const y = d.getFullYear()
//   const m = String(d.getMonth() + 1).padStart(2, '0')
//   const dd = String(d.getDate()).padStart(2, '0')
//   return `${y}-${m}-${dd}`
// }

// /** 0-100 に収める */
// function clamp01(x: number) {
//   if (Number.isFinite(x)) return Math.max(0, Math.min(100, x))
//   return 0
// }

// /** 7日移動平均など */
// function movingAverage(values: number[], w: number) {
//   const res: (number | null)[] = Array(values.length).fill(null)
//   let sum = 0
//   for (let i = 0; i < values.length; i++) {
//     sum += values[i]
//     if (i >= w) sum -= values[i - w]
//     if (i >= w - 1) res[i] = +(sum / w).toFixed(2)
//   }
//   return res
// }

// interface InsightsPageProps {
//   embedMode?: boolean;
// }

// export default function InsightsPage({ embedMode }: InsightsPageProps) {
//   const [range, setRange] = useState<Range>(30)
//   // ResponsiveContainer幅0問題回避
//   const [mounted, setMounted] = useState(false)
//   useEffect(() => setMounted(true), [])

//   // 1) 投稿を「日」単位に集約（同日の複数投稿は平均）
//   const daily = useMemo(() => {
//     const map = new Map<
//       string,
//       { sum: number; count: number; emoji: string | undefined; date: Date }
//     >()
//     for (const p of SAMPLE_POSTS) {
//       const date = new Date(p.createdAt)
//       const key = dayKey(date)
//       const intensity =
//         typeof p.intensity === 'number'
//           ? clamp01(p.intensity)
//           : Math.floor(30 + Math.random() * 40) // フォールバック
//       const rec = map.get(key)
//       if (rec) {
//         rec.sum += intensity
//         rec.count += 1
//         // 代表絵文字は直近のものを採用
//         rec.emoji = p.emoji ?? rec.emoji
//       } else {
//         map.set(key, { sum: intensity, count: 1, emoji: p.emoji, date })
//       }
//     }
//     // 古い→新しい順
//     const rows = Array.from(map.entries())
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .map(([key, v]) => ({
//         day: key,
//         date: v.date,
//         intensity: +(v.sum / v.count).toFixed(2),
//         emoji: v.emoji ?? '🙂',
//       }))
//     return rows
//   }, [])

//   // 2) 期間フィルタ（データが少ないときは自動で 'all'）
//   const filtered = useMemo(() => {
//     if (daily.length === 0) return []
//     if (range === 'all' || daily.length < range) return daily
//     const last = daily.at(-1)!.date
//     const from = new Date(last)
//     from.setHours(0, 0, 0, 0)
//     from.setDate(from.getDate() - (range - 1))
//     return daily.filter((d) => d.date >= from)
//   }, [daily, range])

//   // 3) 7日移動平均
//   const ma7 = useMemo(() => movingAverage(filtered.map((d) => d.intensity), 7), [filtered])

//   // 4) グラフ用データ構造
//   const chartData = filtered.map((d, i) => ({
//     ...d,
//     ma7: ma7[i],
//     // スパイク条件（しきい値は暫定）
//     spike: d.intensity >= 80 || d.intensity <= 20,
//   }))

//   // スパイクのみ抽出（絵文字ピンに使用）
//   const spikes = chartData.filter((d) => d.spike)

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-2xl p-4">
//         <h1 className="mb-4 text-lg font-semibold text-gray-900">ムードダッシュボード</h1>

//         {/* コントロール */}
//         <div className="mb-3 flex items-center justify-between">
//           <div className="flex gap-2">
//             {([7, 30, 90, 'all'] as const).map((r) => (
//               <button
//                 key={r}
//                 onClick={() => setRange(r)}
//                 className={[
//                   'rounded-full px-3 py-1 text-sm border',
//                   range === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700',
//                 ].join(' ')}
//               >
//                 {r === 'all' ? '全期間' : `${r}日`}
//               </button>
//             ))}
//           </div>
//           <div className="text-xs text-gray-500">安定帯: 40–60</div>
//         </div>

//         {/* グラフカード */}
//         <div className="rounded-xl border border-gray-200 bg-white p-4">
//           {!mounted ? (
//             // マウント前はスケルトン（幅0描画の回避）
//             <div className="h-72 animate-pulse rounded-lg bg-gray-100" />
//           ) : chartData.length === 0 ? (
//             <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
//               まずは投稿してデータをためましょう。
//             </div>
//           ) : (
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="day"
//                     type="category"
//                     allowDuplicatedCategory={false}
//                     tick={{ fontSize: 12 }}
//                     minTickGap={24}
//                     tickMargin={8}
//                   />
//                   <YAxis
//                     domain={[0, 100]}
//                     tick={{ fontSize: 12 }}
//                     tickFormatter={(v) => `${v}%`}
//                     width={36}
//                   />
//                   {/* 安定ゾーン帯 */}
//                   <ReferenceArea y1={40} y2={60} fill="#E5F0FF" fillOpacity={0.5} />
//                   <Tooltip
//                     formatter={(value: number, name: string) =>
//                       name === 'intensity' || name === 'ma7' ? [`${value}%`, name] : [value, name]
//                     }
//                     labelFormatter={(label) => `日付: ${label}`}
//                   />
//                   {/* 実測ライン */}
//                   <Line
//                     type="monotone"
//                     dataKey="intensity"
//                     name="抑揚"
//                     stroke="#2563EB"
//                     strokeWidth={2}
//                     dot={false}
//                     isAnimationActive={false}
//                   />
//                   {/* 7日移動平均 */}
//                   <Line
//                     type="monotone"
//                     dataKey="ma7"
//                     name="7日平均"
//                     stroke="#94A3B8"
//                     strokeDasharray="5 5"
//                     dot={false}
//                     isAnimationActive={false}
//                   />
//                   {/* スパイクに絵文字ピン（Scatter + カスタムシェイプ） */}
//                   <Scatter
//                     data={spikes}
//                     shape={({
//                       cx = 0,
//                       cy = 0,
//                       payload,
//                     }: {
//                       cx?: number
//                       cy?: number
//                       payload?: { emoji?: string }
//                     }) => (
//                       <g transform={`translate(${cx - 8}, ${cy - 16})`}>
//                         <text fontSize="14" dominantBaseline="hanging">{payload?.emoji ?? '🙂'}</text>
//                       </g>
//                     )}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//           <p className="mt-2 text-xs text-gray-500">
//             線：抑揚（0–100）。点線：7日移動平均。薄青帯：安定ゾーン（40–60）。
//           </p>
//         </div>
//       </div>
//     </main>
//   )
// }
