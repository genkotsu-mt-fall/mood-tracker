import InsightsCard from './_components/InsightsCard'

export default function MePage() {
  return (
    <div className="h-full overflow-auto">
      <div className="h-full px-4 md:px-6 lg:px-8 pt-6 pb-0">
        <InsightsCard />
      </div>
    </div>
  )
}

// import PostCard from '@/components/post/PostCard'
// import { makeSamplePosts } from '@/components/post/sample/samplePosts'
// import InsightsCard from './_components/InsightsCard'
// import MeMobileTabs from './_components/MeMobileTabs'

// const SAMPLE_POSTS = makeSamplePosts('me')
// const FOLLOWING_MOCK = Array.from({ length: 10 }).map((_, i) => ({ id: `u${i+1}`, name: `ユーザー ${i+1}`, bio: '自己紹介(仮)' }))
// const FOLLOWERS_MOCK = Array.from({ length: 6 }).map((_, i) => ({ id: `f${i+1}`, name: `フォロワー ${i+1}` }))

// export default function MePage() {
//   return (
//     <div className="min-h-screen md:h-[100svh] md:overflow-hidden pb-16 md:pb-0">
//       {/*
//         min-h-screen: 画面の高さに合わせて最低限の高さを確保
//         md:h-[100svh]: md以上の画面幅で100svh(スクリーンの高さ)に
//         md:overflow-hidden: md以上でoverflowを隠す
//         pb-16: 下部パディング(モバイル用)
//         md:pb-0: md以上で下部パディングなし
//       */}
//   <div className="grid grid-cols-1 gap-6 md:h-full lg:flex">
//         {/*
//           grid: グリッドレイアウト
//           grid-cols-1: 1カラム(モバイル)
//           gap-6: グリッド間の隙間
//           md:h-full: md以上で高さ100%
//           lg:grid-cols-12: lg以上で12カラム
//         */}

//         {/* PC用：左カラム（プロフィール＋投稿一覧の内部スクロール） */}
//         <section
//           className="
//             hidden lg:flex
//             /* lg:col-span-8 は削除（幅はFlexで制御） */
//             min-h-0 flex-col min-w-0 lg:h-full
//             basis-0 flex-1              /* ふだん 1:1 の片割れ */
//             lg:hover:flex-[2]           /* hover中だけ 2:1 に拡大 */
//             transition-[flex-grow,flex-basis] duration-[1.2s] ease-out
//             motion-reduce:transition-none
//           "
//         >
//           {/*
//             hidden: モバイル/タブレットでは非表示
//             lg:flex: lg以上でflex表示
//             lg:col-span-8: lg以上で8カラム分を占有
//             min-h-0: 高さの最小値0(スクロール領域用)
//             flex-col: flexの縦並び
//             min-w-0: 幅の最小値0(スクロール領域用)
//             lg:h-full: lg以上で高さ100%
//           */}
//           {/* プロフィール */}
//           <div className="rounded-xl border bg-white p-6">
//             {/*
//               rounded-xl: 角丸
//               border: 枠線
//               bg-white: 背景白
//               p-6: パディング
//             */}
//             <div className="flex items-center gap-3">
//               {/*
//                 flex: 横並び
//                 items-center: 垂直中央揃え
//                 gap-3: 要素間の隙間
//               */}
//               <div className="h-12 w-12 rounded-full bg-gray-200" />
//                 {/*
//                   h-12 w-12: 高さ・幅 3rem
//                   rounded-full: 完全な円形
//                   bg-gray-200: 薄いグレー背景
//                 */}
//               <div>
//                 <h1 className="text-lg font-semibold text-gray-900">あなたのプロフィール</h1>
//                 {/*
//                   text-lg: 大きめ文字
//                   font-semibold: 太字
//                   text-gray-900: 濃いグレー文字
//                 */}
//                 <p className="text-sm text-gray-500">@you • bio は後で編集</p>
//                 {/*
//                   text-sm: 小さめ文字
//                   text-gray-500: 中間グレー文字
//                 */}
//               </div>
//             </div>
//             <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
//               {/*
//                 mt-4: 上マージン
//                 flex flex-wrap: 横並び＋折り返し
//                 gap-3: 要素間の隙間
//                 text-sm: 小さめ文字
//                 text-gray-600: やや薄いグレー文字
//               */}
//               <span>投稿 <b>{SAMPLE_POSTS.length}</b></span>
//               <span>フォロー <b>{FOLLOWING_MOCK.length}</b></span>
//               <span>フォロワー <b>{FOLLOWERS_MOCK.length}</b></span>
//             </div>
//           </div>

//           {/* 投稿一覧（残り高さ=スクロール領域） */}
//           <div className="mt-6 flex-1 min-h-0">
//             {/*
//               mt-6: 上マージン
//               flex-1: 残り高さを埋める
//               min-h-0: 高さの最小値0(スクロール領域用)
//             */}
//             <div className="mb-2 text-2xl font-bold text-gray-900">あなたの投稿一覧</div>
//             <ul className="space-y-4 pr-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] lg:h-full lg:overflow-y-auto">
//               {/*
//                 space-y-4: li間の縦スペース
//                 pr-2: 右パディング
//                 [-webkit-overflow-scrolling:touch]: スクロールの滑らかさ
//                 [scrollbar-width:thin]: 細いスクロールバー
//                 lg:h-full: lg以上で高さ100%
//                 lg:overflow-y-auto: lg以上で縦スクロール
//               */}
//               {SAMPLE_POSTS.map((p) => (
//                 <li key={p.id}>
//                   <PostCard post={p} />
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         {/* SP/タブレット用：プロフィール＋サブタブ（Posts/Insights/Following/Followers） */}
//         <section className="lg:hidden">
//           {/*
//             lg:hidden: lg以上で非表示(モバイル/タブレット用)
//           */}
//           {/* プロフィール（SPでも上に固定表示） */}
//           <div className="rounded-xl border bg-white p-6">
//             {/* ...PCと同じTailwind解説... */}
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 rounded-full bg-gray-200" />
//               <div>
//                 <h1 className="text-lg font-semibold text-gray-900">あなたのプロフィール</h1>
//                 <p className="text-sm text-gray-500">@you • bio は後で編集</p>
//               </div>
//             </div>
//             <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
//               <span>投稿 <b>{SAMPLE_POSTS.length}</b></span>
//               <span>フォロー <b>{FOLLOWING_MOCK.length}</b></span>
//               <span>フォロワー <b>{FOLLOWERS_MOCK.length}</b></span>
//             </div>
//           </div>

//           {/* サブタブ本体（各タブが独立スクロール） */}
//           <div className="mt-4">
//             {/* mt-4: 上マージン */}
//             <MeMobileTabs
//               counts={{ posts: SAMPLE_POSTS.length, following: FOLLOWING_MOCK.length, followers: FOLLOWERS_MOCK.length }}
//               postsPanel={
//                 <ul className="space-y-4">
//                   {/* space-y-4: li間の縦スペース */}
//                   {SAMPLE_POSTS.map((p) => (
//                     <li key={p.id}>
//                       <PostCard post={p} />
//                     </li>
//                   ))}
//                 </ul>
//               }
//               insightsPanel={<InsightsCard />}
//               followingPanel={
//                 <div className="rounded-xl border bg-white p-6">
//                   {/* ...PCと同じTailwind解説... */}
//                   <ul className="space-y-2">
//                     {/* space-y-2: li間の縦スペース */}
//                     {FOLLOWING_MOCK.map((u) => (
//                       <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
//                         {/*
//                           flex: 横並び
//                           items-center: 垂直中央揃え
//                           justify-between: 両端揃え
//                           rounded-lg: 角丸
//                           border border-gray-100: 枠線(薄いグレー)
//                           bg-gray-50: 薄いグレー背景
//                           p-2: パディング
//                         */}
//                         <div className="flex items-center gap-3">
//                           {/* flex: 横並び, items-center: 垂直中央, gap-3: 隙間 */}
//                           <div className="h-8 w-8 rounded-full bg-gray-200" />
//                             {/* h-8 w-8: 2rem, rounded-full: 円形, bg-gray-200: 薄グレー */}
//                           <div>
//                             <div className="text-sm font-semibold">{u.name}</div>
//                             <div className="text-xs text-gray-500">@{u.id}</div>
//                           </div>
//                         </div>
//                         <button disabled className="text-xs text-red-600 opacity-60">解除</button>
//                           {/* text-xs: 極小文字, text-red-600: 赤文字, opacity-60: 半透明 */}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               }
//               followersPanel={
//                 <div className="rounded-xl border bg-white p-6">
//                   {/* ...PCと同じTailwind解説... */}
//                   <ul className="space-y-2">
//                     {/* space-y-2: li間の縦スペース */}
//                     {FOLLOWERS_MOCK.map((u) => (
//                       <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
//                         {/* ...上と同じTailwind解説... */}
//                         <div className="flex items-center gap-3">
//                           {/* flex: 横並び, items-center: 垂直中央, gap-3: 隙間 */}
//                           <div className="h-8 w-8 rounded-full bg-gray-200" />
//                             {/* h-8 w-8: 2rem, rounded-full: 円形, bg-gray-200: 薄グレー */}
//                           <div className="text-sm font-semibold">{u.name}</div>
//                         </div>
//                         <button disabled className="text-xs text-blue-600 opacity-60">フォロー</button>
//                           {/* text-xs: 極小文字, text-blue-600: 青文字, opacity-60: 半透明 */}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               }
//             />
//           </div>
//         </section>

//         {/* 右カラム：PCのみ（独立スクロール） */}
//         <aside
//           className="
//             hidden lg:flex
//             /* lg:col-span-4 は削除 */
//             h-full min-h-0 flex-col gap-6 overflow-y-auto pr-2
//             basis-0 flex-1              /* ふだん 1:1 の相方 */
//             lg:hover:flex-[2]           /* こちらをhoverした時に横比率拡大 */
//             transition-[flex-grow,flex-basis,height] duration-[1.2s] ease-out
//             motion-reduce:transition-none
//             min-w-0                     /* 内容のはみ出し防止（重要） */
//           "
//         >
//           {/*
//             hidden: モバイル/タブレットでは非表示
//             lg:flex: lg以上でflex表示
//             lg:col-span-4: lg以上で4カラム分を占有
//             h-full: 高さ100%
//             min-h-0: 高さの最小値0(スクロール領域用)
//             flex-col: flexの縦並び
//             gap-6: 要素間の隙間
//             overflow-y-auto: 縦スクロール
//             pr-2: 右パディング
//           */}
//           <InsightsCard />

//           <div className="rounded-xl border bg-white p-6">
//             {/* ...PCと同じTailwind解説... */}
//             <div className="mb-2 text-sm font-semibold text-gray-700">フォロー中</div>
//             <ul className="space-y-2">
//               {/* space-y-2: li間の縦スペース */}
//               {FOLLOWING_MOCK.map((u) => (
//                 <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
//                   {/* ...上と同じTailwind解説... */}
//                   <div className="flex items-center gap-3">
//                     {/* flex: 横並び, items-center: 垂直中央, gap-3: 隙間 */}
//                     <div className="h-8 w-8 rounded-full bg-gray-200" />
//                       {/* h-8 w-8: 2rem, rounded-full: 円形, bg-gray-200: 薄グレー */}
//                     <div>
//                       <div className="text-sm font-semibold">{u.name}</div>
//                       <div className="text-xs text-gray-500">@{u.id}</div>
//                     </div>
//                   </div>
//                   <button disabled className="text-xs text-red-600 opacity-60">フォロー解除</button>
//                     {/* text-xs: 極小文字, text-red-600: 赤文字, opacity-60: 半透明 */}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-xl border bg-white p-6">
//             {/* ...PCと同じTailwind解説... */}
//             <div className="mb-2 text-sm font-semibold text-gray-700">フォロワー</div>
//             <ul className="space-y-2">
//               {/* space-y-2: li間の縦スペース */}
//               {FOLLOWERS_MOCK.map((u) => (
//                 <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
//                   {/* ...上と同じTailwind解説... */}
//                   <div className="flex items-center gap-3">
//                     {/* flex: 横並び, items-center: 垂直中央, gap-3: 隙間 */}
//                     <div className="h-8 w-8 rounded-full bg-gray-200" />
//                       {/* h-8 w-8: 2rem, rounded-full: 円形, bg-gray-200: 薄グレー */}
//                     <div className="text-sm font-semibold">{u.name}</div>
//                   </div>
//                   <button disabled className="text-xs text-blue-600 opacity-60">フォローする</button>
//                     {/* text-xs: 極小文字, text-blue-600: 青文字, opacity-60: 半透明 */}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>

//       </div>
//     </div>
//   )
// }
