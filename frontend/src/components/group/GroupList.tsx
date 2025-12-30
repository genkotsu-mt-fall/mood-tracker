'use client';

import Link from 'next/link';
import type { GroupListDeleteApi } from './useGroupListDelete';

export type GroupListItem = {
  id: string;
  name: string;
  count?: number;
};

export default function GroupList({
  items,
  deleteApi,
}: {
  items: GroupListItem[];
  deleteApi?: GroupListDeleteApi;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        グループがありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {deleteApi?.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {deleteApi.error}
        </div>
      ) : null}

      <ul className="space-y-2">
        {items.map((g) => (
          <li
            key={g.id}
            className="rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <Link href={`/groups/${g.id}`} className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{g.name}</div>
                {typeof g.count === 'number' ? (
                  <div className="text-xs text-gray-500">
                    メンバー {g.count}
                  </div>
                ) : null}
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/groups/${g.id}`}
                  className="text-sm text-blue-600"
                >
                  詳細 →
                </Link>

                {deleteApi ? (
                  <button
                    type="button"
                    className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                    disabled={deleteApi.deletingId === g.id}
                    onClick={() => deleteApi.requestDelete(g.id, g.name)}
                  >
                    {deleteApi.deletingId === g.id ? '削除中…' : '削除'}
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
