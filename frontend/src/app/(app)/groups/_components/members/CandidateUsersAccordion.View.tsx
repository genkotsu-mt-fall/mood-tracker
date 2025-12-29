'use client';

import { useMemo, useState } from 'react';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { useMembersDraft } from '@/components/group-edit/GroupEditProvider';

function labelOf(u: UserResource): string {
  return u.name ?? u.email ?? u.id;
}

export default function CandidateUsersAccordionView({
  candidates,
  baseIds,
}: {
  candidates: UserResource[];
  baseIds: Set<string>;
}) {
  const editor = useMembersDraft();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return candidates;

    return candidates.filter((u) => {
      const hay = `${u.id} ${u.name ?? ''} ${u.email ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [candidates, q]);

  return (
    <details className="mt-3 rounded-lg border border-gray-200">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
        候補ユーザー（{candidates.length}）
      </summary>

      <div className="px-3 pb-3">
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 rounded-md border px-2 py-1 text-sm"
            placeholder="検索（名前 / email / id）"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <ul className="mt-3 space-y-1">
          {filtered.map((u) => {
            const id = u.id;

            const isMember = baseIds.has(id) && !editor.removedIds.has(id);
            const isAdded = editor.addedMembers.has(id) && !baseIds.has(id);

            const canPick =
              editor.editable &&
              (!isMember || editor.removedIds.has(id)) &&
              !isAdded;

            const helper = isMember
              ? 'メンバー'
              : editor.removedIds.has(id)
                ? '削除予定（追加で取り消し）'
                : isAdded
                  ? '追加予定'
                  : '';

            return (
              <li
                key={id}
                className="flex items-center justify-between rounded-md border px-2 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm">{labelOf(u)}</div>
                  {helper ? (
                    <div className="text-xs text-gray-500">{helper}</div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-60"
                  disabled={!canPick}
                  onClick={() => editor.addFromCandidate(u, baseIds)}
                >
                  追加
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
