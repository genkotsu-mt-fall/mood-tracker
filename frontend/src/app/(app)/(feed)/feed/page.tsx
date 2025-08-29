import PostCard from '@/components/post/PostCard'
import { makeSamplePosts } from '@/components/post/sample/samplePosts'

const SAMPLE_POSTS = makeSamplePosts('hp')

export default function HomeFeedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        {/* <h1 className="mb-4 text-lg font-semibold text-gray-900">Feed</h1> */}
        <ul className="space-y-3">
          {SAMPLE_POSTS.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
