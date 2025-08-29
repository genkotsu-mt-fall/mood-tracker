'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type View = 'posts' | 'insights' | 'following' | 'followers'
const VIEWS: View[] = ['posts', 'insights', 'following', 'followers']

export default function MeMobileTabs({
  counts,
  postsPanel,
  insightsPanel,
  followingPanel,
  followersPanel,
}: {
  counts: { posts: number; following: number; followers: number }
  postsPanel: React.ReactNode
  insightsPanel: React.ReactNode
  followingPanel: React.ReactNode
  followersPanel: React.ReactNode
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const initial = (sp.get('view') as View) || 'posts'
  const [view, setView] = useState<View>(initial)

  // URLと同期（戻る/共有に強い）
  useEffect(() => {
    const params = new URLSearchParams(Array.from(sp.entries()))
    params.set('view', view)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [view])

  // タブごとスクロール位置保持（簡易）
  const scrollSaved = useRef<Record<View, number>>({ posts: 0, insights: 0, following: 0, followers: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const switchTo = (v: View) => {
    // 現在のスクロールを保存
    if (panelRef.current) scrollSaved.current[view] = panelRef.current.scrollTop
    setView(v)
    // 次のスクロール復元
    requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.scrollTop = scrollSaved.current[v] || 0
    })
  }

  const tabs = useMemo(
    () => [
      { key: 'posts', label: `投稿 ${counts.posts}` },
      { key: 'insights', label: 'インサイト' },
      { key: 'following', label: `フォロー中 ${counts.following}` },
      { key: 'followers', label: `フォロワー ${counts.followers}` },
    ] as { key: View; label: string }[],
    [counts]
  )

  // 表示中パネルをキー付きで決定
  const currentPanel = React.useMemo(() => {
    switch (view) {
      case 'posts':
        return <div key="panel-posts">{postsPanel}</div>
      case 'insights':
        return <div key="panel-insights">{insightsPanel}</div>
      case 'following':
        return <div key="panel-following">{followingPanel}</div>
      case 'followers':
      default:
        return <div key="panel-followers">{followersPanel}</div>
    }
  }, [view, postsPanel, insightsPanel, followingPanel, followersPanel])

  return (
    <div className="lg:hidden">
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
