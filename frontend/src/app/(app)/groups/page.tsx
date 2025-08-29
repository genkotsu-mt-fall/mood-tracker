const GROUPS = [
  { id: 'g1', name: '家族', count: 4 },
  { id: 'g2', name: '友人', count: 8 },
  { id: 'g3', name: '職場', count: 12 },
]

import Link from 'next/link'

export default function GroupsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">グループ</h1>
        <ul className="space-y-2">
          {GROUPS.map((g) => (
            <li key={g.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <Link href={`/groups/${g.id}`} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{g.name}</div>
                  <div className="text-xs text-gray-500">メンバー {g.count}</div>
                </div>
                <span className="text-sm text-blue-600">詳細 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
