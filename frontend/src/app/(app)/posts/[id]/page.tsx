import Link from 'next/link'
import PostCard from '@/components/post/PostCard'
import { makeSamplePosts } from '@/components/post/sample/samplePosts'

type Props = { params: Promise<{ id: string }> }

export default async function PostDetailPage({ params }: Props) {
  // ✅ params を await してから使う
  const { id } = await params
  const posts = makeSamplePosts('d')
  const post = posts.find((p) => p.id === id) ?? posts[0]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <nav className="mb-3 text-sm">
          <Link href="/feed" className="text-blue-600 hover:underline">← 戻る</Link>
        </nav>
        <h1 className="mb-3 text-lg font-semibold text-gray-900">投稿</h1>
        <PostCard post={post} />
        <section className="mt-4 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600">
          <p>ここにコメント一覧／操作（編集・削除: 所有者のみ）を後で追加</p>
        </section>
      </div>
    </main>
  )
}
