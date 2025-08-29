'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type View = 'feed' | 'following' | 'insights' | 'recommend'

export default function FeedMobileTabs({
  counts,
  feedPanel,
  followingPanel,
  insightsPanel,
  recommendPanel,
}: {
  counts: { feed: number; following: number }
  feedPanel: React.ReactNode
  followingPanel: React.ReactNode
  insightsPanel: React.ReactNode
  recommendPanel: React.ReactNode
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const initial = (sp.get('tab') as View) || 'feed'
  const [view, setView] = useState<View>(initial)

  // URL同期（共有/戻る対応）
  useEffect(() => {
    const params = new URLSearchParams(Array.from(sp.entries()))
    params.set('tab', view)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [view])

  // タブごとのスクロール位置を保持
  const saved = useRef<Record<View, number>>({ feed: 0, following: 0, insights: 0, recommend: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const switchTo = (v: View) => {
    if (panelRef.current) saved.current[view] = panelRef.current.scrollTop
    setView(v)
    requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.scrollTop = saved.current[v] || 0
    })
  }

  const tabs = useMemo(
    () => [
      { key: 'feed', label: `Feed ${counts.feed}` },
      { key: 'following', label: `Following ${counts.following}` },
      { key: 'insights', label: 'インサイト' },
      { key: 'recommend', label: 'おすすめ' },
    ] as { key: View; label: string }[],
    [counts]
  )

  const currentPanel = useMemo(() => {
    switch (view) {
      case 'feed': return <div key="panel-feed">{feedPanel}</div>
      case 'following': return <div key="panel-following">{followingPanel}</div>
      case 'insights': return <div key="panel-insights">{insightsPanel}</div>
      case 'recommend':
      default: return <div key="panel-recommend">{recommendPanel}</div>
    }
  }, [view, feedPanel, followingPanel, insightsPanel, recommendPanel])

  return (
    <div>
      {/* sticky タブバー */}
      <div className="sticky top-0 z-10 -mx-4 mb-3 bg-gray-50 px-4 pt-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => switchTo(t.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${
                view === t.key ? 'border-blue-600 bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* パネル（内部スクロール） */}
      <div ref={panelRef} className="max-h-[calc(100svh-220px)] overflow-y-auto pr-2">
        {currentPanel}
      </div>
    </div>
  )
}
