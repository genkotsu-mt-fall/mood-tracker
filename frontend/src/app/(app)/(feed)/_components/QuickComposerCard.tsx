import Link from 'next/link'

export default function QuickComposerCard() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 text-sm font-semibold text-gray-700">クイック投稿</div>
      <textarea
        className="w-full resize-none rounded-md border px-2 py-2 text-sm text-gray-700"
        rows={3}
        placeholder="いまの気持ちをメモ（UIのみ / 実投稿は /compose から）"
        disabled
      />
      <div className="mt-2 text-right">
        <Link href="/compose" className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white inline-block">
          /compose を開く
        </Link>
      </div>
    </div>
  )
}
