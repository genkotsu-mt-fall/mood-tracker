const MOCK = Array.from({ length: 6 }).map((_, i) => ({ id: `f${i+1}`, name: `フォロワー ${i+1}` }))

export default function MeFollowersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">フォロワー</h1>
        <ul className="space-y-2">
          {MOCK.map((u) => (
            <li key={u.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="text-sm font-semibold">{u.name}</div>
              </div>
              <button disabled className="text-sm text-blue-600 opacity-60">フォローする</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
