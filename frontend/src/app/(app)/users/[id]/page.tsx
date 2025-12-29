import PostCard from '@/components/post/PostCard';
import { makeSamplePosts } from '@/components/post/sample/samplePosts';

function FollowButton() {
  return (
    <button
      disabled
      className="rounded-full bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white opacity-60"
    >
      フォロー(後でAPI)
    </button>
  );
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const posts = makeSamplePosts('u');
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <header className="mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                ユーザー {(await params).id}
              </h1>
              <p className="text-sm text-gray-500">
                簡易プロフィール文が入ります
              </p>
            </div>
            <FollowButton />
          </div>
        </header>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
