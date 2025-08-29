const MOCK = Array.from({ length: 10 }).map((_, i) => ({ id: `u${i+1}`, name: `ユーザー ${i+1}`, bio: '自己紹介(仮)' }))

export default function MeFollowingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">フォロー中</h1>
        <ul className="space-y-2">
          {MOCK.map((u) => (
            <li key={u.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div>
                  <div className="text-sm font-semibold">{u.name}</div>
                  <div className="text-xs text-gray-500">@{u.id}</div>
                </div>
              </div>
              <button disabled className="text-sm text-red-600 opacity-60">フォロー解除</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
