// サーバーコンポーネント
import type { ReactNode } from 'react';
import TabsNav from './_components/TabsNav';
// import WhoToFollowCard from './_components/WhoToFollowCard';
// import FeedMobileTabs from './_components/FeedMobileTabs';
// import PostCard from '@/components/post/PostCard';
// import { makeSamplePosts } from '@/components/post/sample/samplePosts';

// import InsightsCard from '@/components/insights/InsightsCard';
import RightPanel from '@/components/app/RightPanel';
import { RightPanelProvider } from '@/components/app/RightPanelContext';

export default function FeedGroupLayout({ children }: { children: ReactNode }) {
  // const FEED_POSTS = makeSamplePosts('hp');
  // const FOLLOWING_POSTS = makeSamplePosts('p');

  // const feedPanel = (
  //   <ul className="space-y-3">
  //     {FEED_POSTS.map((p) => (
  //       <li key={p.id}>
  //         <PostCard post={p} />
  //       </li>
  //     ))}
  //   </ul>
  // );

  // const followingPanel = (
  //   <ul className="space-y-3">
  //     {FOLLOWING_POSTS.map((p) => (
  //       <li key={p.id}>
  //         <PostCard post={p} />
  //       </li>
  //     ))}
  //   </ul>
  // );

  return (
    <RightPanelProvider>
      {/* PC は縦横ともに画面いっぱい */}
      <main className="bg-gray-50 min-h-screen lg:h-[100svh] lg:overflow-hidden">
        {/* モバイル/タブレットは余白あり、PC は余白なし＆最大幅解除 */}
        <div className="p-4 md:p-6 lg:p-0 lg:max-w-none lg:mx-0 lg:h-full lg:min-h-0">
          {/* ▼ PC: 1カラムで全幅・全高（右サイドなし） */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-0 lg:h-full lg:min-h-0">
            <section className="lg:col-span-12 min-w-0 lg:h-full lg:min-h-0 lg:flex lg:flex-col">
              <div className="mb-4 lg:mb-0 shrink-0">
                <TabsNav />
              </div>
              {/* children が残り高さを占有できるようにする */}
              <div className="lg:flex-1 lg:min-h-0">{children}</div>
            </section>

            {/* 右サイドは全幅化のため非表示（復活させるなら 8/4 に戻せます） */}
            {/*
            <aside className="lg:col-span-4 min-h-0 flex-col gap-6 hidden lg:flex">
              <QuickComposerCard />
              <InsightsCard />
              <WhoToFollowCard />
            </aside>
            */}
          </div>

          {/* ▼ SP/タブレット: 4タブ（Feed/Following/インサイト/おすすめ） */}
          <div className="lg:hidden">
            {/* <FeedMobileTabs
              counts={{
                feed: FEED_POSTS.length,
                following: FOLLOWING_POSTS.length,
              }}
              feedPanel={feedPanel}
              followingPanel={followingPanel}
              insightsPanel={<InsightsCard />}
              recommendPanel={<WhoToFollowCard embed />}
            /> */}
          </div>
        </div>
      </main>
      <RightPanel />
    </RightPanelProvider>
  );
}
