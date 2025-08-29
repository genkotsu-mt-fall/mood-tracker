export default function SettingsVisibilityPage() {
  const PRESETS = [
    { id: 'public', name: '全体公開', json: '{"public": true}' },
    { id: 'followers', name: 'フォロワーまで', json: '{"followers": true}' },
    { id: 'family', name: '家族グループ', json: '{"groups": ["family"]}' },
  ]
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">可視性プリセット</h1>
        <div className="space-y-3">
          {PRESETS.map((p) => (
            <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.json}</div>
                </div>
                <button disabled className="text-sm text-blue-600 opacity-60">適用</button>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm font-semibold">新規作成</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input className="rounded-md border px-2 py-1 text-sm" placeholder="名前" />
              <input className="rounded-md border px-2 py-1 text-sm" placeholder='{"public":true}' />
            </div>
            <div className="mt-2 text-right text-xs text-gray-500">保存は後でAPI</div>
          </div>
        </div>
      </div>
    </main>
  )
}
