import Link from 'next/link';
import PostEditRemote from './_components/PostEdit.Remote';

type Props = { params: Promise<{ id: string }> };

export default async function PostEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <nav className="mb-3 text-sm">
          <Link href={`/posts/${id}`} className="text-blue-600 hover:underline">
            ← 戻る
          </Link>
        </nav>

        <PostEditRemote id={id} />
      </div>
    </main>
  );
}
