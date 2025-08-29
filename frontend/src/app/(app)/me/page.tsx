

import PostCard from '@/components/post/PostCard'
import { makeSamplePosts } from '@/components/post/sample/samplePosts'
import InsightsCard from './_components/InsightsCard'
import MeMobileTabs from './_components/MeMobileTabs'

const SAMPLE_POSTS = makeSamplePosts('me')
const FOLLOWING_MOCK = Array.from({ length: 10 }).map((_, i) => ({ id: `u${i+1}`, name: `ユーザー ${i+1}`, bio: '自己紹介(仮)' }))
const FOLLOWERS_MOCK = Array.from({ length: 6 }).map((_, i) => ({ id: `f${i+1}`, name: `フォロワー ${i+1}` }))

export default function MePage() {
  return (
    <div className="min-h-screen md:h-[100svh] md:overflow-hidden pb-16 md:pb-0">
      <div className="grid grid-cols-1 gap-6 md:h-full lg:grid-cols-12">

        {/* PC用：左カラム（プロフィール＋投稿一覧の内部スクロール） */}
        <section className="hidden lg:flex lg:col-span-8 min-h-0 flex-col min-w-0 lg:h-full">
          {/* プロフィール */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">あなたのプロフィール</h1>
                <p className="text-sm text-gray-500">@you • bio は後で編集</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
              <span>投稿 <b>{SAMPLE_POSTS.length}</b></span>
              <span>フォロー <b>{FOLLOWING_MOCK.length}</b></span>
              <span>フォロワー <b>{FOLLOWERS_MOCK.length}</b></span>
            </div>
          </div>

          {/* 投稿一覧（残り高さ=スクロール領域） */}
          <div className="mt-6 flex-1 min-h-0">
            <div className="mb-2 text-2xl font-bold text-gray-900">あなたの投稿一覧</div>
            <ul className="space-y-4 pr-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] lg:h-full lg:overflow-y-auto">
              {SAMPLE_POSTS.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SP/タブレット用：プロフィール＋サブタブ（Posts/Insights/Following/Followers） */}
        <section className="lg:hidden">
          {/* プロフィール（SPでも上に固定表示） */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">あなたのプロフィール</h1>
                <p className="text-sm text-gray-500">@you • bio は後で編集</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
              <span>投稿 <b>{SAMPLE_POSTS.length}</b></span>
              <span>フォロー <b>{FOLLOWING_MOCK.length}</b></span>
              <span>フォロワー <b>{FOLLOWERS_MOCK.length}</b></span>
            </div>
          </div>

          {/* サブタブ本体（各タブが独立スクロール） */}
          <div className="mt-4">
            <MeMobileTabs
              counts={{ posts: SAMPLE_POSTS.length, following: FOLLOWING_MOCK.length, followers: FOLLOWERS_MOCK.length }}
              postsPanel={
                <ul className="space-y-4">
                  {SAMPLE_POSTS.map((p) => (
                    <li key={p.id}>
                      <PostCard post={p} />
                    </li>
                  ))}
                </ul>
              }
              insightsPanel={<InsightsCard />}
              followingPanel={
                <div className="rounded-xl border bg-white p-6">
                  <ul className="space-y-2">
                    {FOLLOWING_MOCK.map((u) => (
                      <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                          <div>
                            <div className="text-sm font-semibold">{u.name}</div>
                            <div className="text-xs text-gray-500">@{u.id}</div>
                          </div>
                        </div>
                        <button disabled className="text-xs text-red-600 opacity-60">解除</button>
                      </li>
                    ))}
                  </ul>
                </div>
              }
              followersPanel={
                <div className="rounded-xl border bg-white p-6">
                  <ul className="space-y-2">
                    {FOLLOWERS_MOCK.map((u) => (
                      <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                          <div className="text-sm font-semibold">{u.name}</div>
                        </div>
                        <button disabled className="text-xs text-blue-600 opacity-60">フォロー</button>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          </div>
        </section>

        {/* 右カラム：PCのみ（独立スクロール） */}
        <aside className="hidden lg:flex lg:col-span-4 h-full min-h-0 flex-col gap-6 overflow-y-auto pr-2">
          <InsightsCard />

          <div className="rounded-xl border bg-white p-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">フォロー中</div>
            <ul className="space-y-2">
              {FOLLOWING_MOCK.map((u) => (
                <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <div className="text-sm font-semibold">{u.name}</div>
                      <div className="text-xs text-gray-500">@{u.id}</div>
                    </div>
                  </div>
                  <button disabled className="text-xs text-red-600 opacity-60">フォロー解除</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">フォロワー</div>
            <ul className="space-y-2">
              {FOLLOWERS_MOCK.map((u) => (
                <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="text-sm font-semibold">{u.name}</div>
                  </div>
                  <button disabled className="text-xs text-blue-600 opacity-60">フォローする</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  )
}
