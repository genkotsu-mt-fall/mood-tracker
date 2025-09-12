'use client'

import type { Option } from '@/lib/common/types'

type Props = {
  activeGroupId: string | null;
  groups: Option[];
  className?: string;
};

export default function GroupDetailDock({ activeGroupId, groups, className = '' }: Props) {
  const g = activeGroupId ? groups.find((x) => x.id === activeGroupId) : undefined

  // ダミー（将来API連携で差し替え）
  const mock = g && {
    members: 12,
    createdAt: '2024-04-12',
    description: g.label === 'Work' ? '会社メンバー向けのグループ' : '家族・親しい友人向け',
    rules: ['投稿は社外秘を含まない', '誹謗中傷禁止', 'ネガティブな日は優しく'],
  }

  return (
    <aside
      className={`rounded-2xl border bg-white shadow-sm min-h-[360px] ${className}`}
    >
      <div className="h-full overflow-auto p-5">
        <div className="mb-3 text-sm text-gray-500">グループ詳細</div>

        {!g ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-500">
            許可グループの行にカーソルを合わせると詳細が表示されます
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-xl font-semibold">{g.label}</h3>

            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">メンバー数</div>
                <div className="text-lg font-medium">{mock!.members}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">作成日</div>
                <div className="text-lg font-medium">{mock!.createdAt}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">可視性</div>
                <div className="text-lg font-medium">許可対象</div>
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-700">{mock!.description}</p>

            <div>
              <div className="mb-2 text-xs text-gray-500">ローカルルール例</div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">

                {mock!.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}


