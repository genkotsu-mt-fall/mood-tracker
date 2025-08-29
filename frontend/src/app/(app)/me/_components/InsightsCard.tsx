"use client"

import { useMemo, useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceArea, CartesianGrid, Scatter,
} from 'recharts'
import { makeSamplePosts } from '@/components/post/sample/samplePosts'

type Range = 7 | 30 | 90 | 'all'
const SAMPLE_POSTS = makeSamplePosts('insights')

function dayKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
function clamp01(x: number) { return Number.isFinite(x) ? Math.max(0, Math.min(100, x)) : 0 }
function movingAverage(values: number[], w: number) {
  const res: (number | null)[] = Array(values.length).fill(null)
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]; if (i >= w) sum -= values[i - w]
    if (i >= w - 1) res[i] = +(sum / w).toFixed(2)
  }
  return res
}

export default function InsightsCard() {
  const [range, setRange] = useState<Range>(30)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const daily = useMemo(() => {
    const map = new Map<string, { sum: number; count: number; emoji?: string; date: Date }>()
    for (const p of SAMPLE_POSTS) {
      const date = new Date(p.createdAt)
      const key = dayKey(date)
      const intensity = typeof p.intensity === 'number' ? clamp01(p.intensity) : Math.floor(30 + Math.random() * 40)
      const rec = map.get(key)
      if (rec) { rec.sum += intensity; rec.count += 1; rec.emoji = p.emoji ?? rec.emoji }
      else { map.set(key, { sum: intensity, count: 1, emoji: p.emoji, date }) }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, v]) => ({ day: key, date: v.date, intensity: +(v.sum / v.count).toFixed(2), emoji: v.emoji ?? '🙂' }))
  }, [])

  const filtered = useMemo(() => {
    if (daily.length === 0) return []
    if (range === 'all' || daily.length < range) return daily
    const last = daily.at(-1)!.date
    const from = new Date(last); from.setHours(0, 0, 0, 0); from.setDate(from.getDate() - (range - 1))
    return daily.filter((d) => d.date >= from)
  }, [daily, range])

  const ma7 = useMemo(() => movingAverage(filtered.map((d) => d.intensity), 7), [filtered])
  const chartData = filtered.map((d, i) => ({ ...d, ma7: ma7[i], spike: d.intensity >= 80 || d.intensity <= 20 }))
  const spikes = chartData.filter((d) => d.spike)

  return (
    <article className="rounded-xl border bg-white p-6">
      <div className="mb-3 text-sm font-semibold text-gray-900">ムードインサイト</div>

      {/* コントロール */}
      <div className="mb-3 flex gap-2">
        {([7, 30, 90, 'all'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              'rounded-full px-3 py-1 text-xs border',
              range === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700',
            ].join(' ')}
          >
            {r === 'all' ? '全期間' : `${r}日`}
          </button>
        ))}
        <div className="ml-auto self-center text-[11px] text-gray-500">安定帯: 40–60</div>
      </div>

      {/* グラフ */}
      {!mounted ? (
        <div className="h-56 animate-pulse rounded-lg bg-gray-100" />
      ) : chartData.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
          まずは投稿してデータをためましょう。
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} tick={{ fontSize: 11 }} minTickGap={18} tickMargin={6} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} width={34} />
              <ReferenceArea y1={40} y2={60} fill="#E5F0FF" fillOpacity={0.5} />
              <Tooltip
                formatter={(value: number | string, name: string) =>
                  name === 'intensity' || name === 'ma7' ? [`${value}%`, name] : [value, name]
                }
                labelFormatter={(label) => `日付: ${label}`}
              />
              <Line type="monotone" dataKey="intensity" name="抑揚" stroke="#2563EB" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ma7" name="7日平均" stroke="#94A3B8" strokeDasharray="5 5" dot={false} isAnimationActive={false} />
              <Scatter
                data={spikes}
                shape={({
                  cx = 0,
                  cy = 0,
                  payload,
                }: {
                  cx?: number
                  cy?: number
                  payload?: { emoji?: string }
                }) => (
                  <g transform={`translate(${cx - 8}, ${cy - 16})`}>
                    <text fontSize="14" dominantBaseline="hanging">{payload?.emoji ?? '🙂'}</text>
                  </g>
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-2 text-[11px] text-gray-500">
        線：抑揚（0–100）。点線：7日移動平均。薄青帯：安定ゾーン（40–60）。
      </p>
    </article>
  )
}
