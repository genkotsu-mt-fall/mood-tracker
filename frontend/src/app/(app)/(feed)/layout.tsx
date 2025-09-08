// サーバーコンポーネント
import type { ReactNode } from 'react'
import TabsNav from './_components/TabsNav'
import InsightsCard from '@/app/(app)/me/_components/InsightsCard'
import WhoToFollowCard from './_components/WhoToFollowCard'
import QuickComposerCard from './_components/QuickComposerCard'
import FeedMobileTabs from './_components/FeedMobileTabs'
import PostCard from '@/components/post/PostCard'
import { makeSamplePosts } from '@/components/post/sample/samplePosts'

import { RightPanelProvider } from "@/app/(app)/_components/right-panel/RightPanelContext";
import RightPanel from "../_components/right-panel/RightPanel";

export default function FeedGroupLayout({ children }: { children: ReactNode }) {
  const FEED_POSTS = makeSamplePosts('hp')
  const FOLLOWING_POSTS = makeSamplePosts('p')

  const feedPanel = (
    <ul className="space-y-3">
      {FEED_POSTS.map((p) => (
        <li key={p.id}><PostCard post={p} /></li>
      ))}
    </ul>
  )

  const followingPanel = (
    <ul className="space-y-3">
      {FOLLOWING_POSTS.map((p) => (
        <li key={p.id}><PostCard post={p} /></li>
      ))}
    </ul>
  )

  return (
    <RightPanelProvider>
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-screen-xl p-4 md:p-6">
          {/* ▼ PC: 左だけにタブ、右は独立 */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
            {/* 左：タイムライン（children） */}
            <section className="lg:col-span-8 min-w-0">
              <div className="mb-4">
                <TabsNav /> {/* ← タブは左カラム内だけに表示 */}
              </div>
              {children}
            </section>

            {/* 右：サイド（独立コンテンツ） */}
            <aside className="lg:col-span-4 min-h-0 flex-col gap-6 hidden lg:flex">
              <QuickComposerCard />
              <InsightsCard />
              <WhoToFollowCard />
            </aside>
          </div>

          {/* ▼ SP/タブレット: 4タブ（Feed/Following/インサイト/おすすめ） */}
          <div className="lg:hidden">
            <FeedMobileTabs
              counts={{ feed: FEED_POSTS.length, following: FOLLOWING_POSTS.length }}
              feedPanel={feedPanel}
              followingPanel={followingPanel}
              insightsPanel={<InsightsCard />}
              recommendPanel={<WhoToFollowCard embed />}
            />
          </div>
        </div>
      </main>
      <RightPanel />
    </RightPanelProvider>
  )
}
