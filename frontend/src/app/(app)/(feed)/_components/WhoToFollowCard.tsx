type Props = { embed?: boolean }
const MOCK = Array.from({ length: 6 }).map((_, i) => ({ id: `u${i+1}`, name: `おすすめ ${i+1}` }))

export default function WhoToFollowCard({ embed }: Props) {
  const items = embed ? MOCK.slice(0, 4) : MOCK
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 text-sm font-semibold text-gray-700">おすすめユーザー</div>
      <ul className="space-y-2">
        {items.map((u) => (
          <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div>
                <div className="text-sm font-semibold">{u.name}</div>
                <div className="text-xs text-gray-500">@{u.id}</div>
              </div>
            </div>
            <button disabled className="text-xs text-blue-600 opacity-60">フォロー</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
