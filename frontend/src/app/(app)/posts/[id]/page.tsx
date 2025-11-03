import Link from 'next/link';
import PostDetailRemote from '../_components/PostDetail.Remote';

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params; // ← await 重要

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <nav className="mb-3 text-sm">
          <Link href="/feed" className="text-blue-600 hover:underline">
            ← 戻る
          </Link>
        </nav>
        <h1 className="mb-3 text-lg font-semibold text-gray-900">投稿</h1>
        <PostDetailRemote id={id} />
      </div>
    </main>
  );
}
