'use client';

import type { GroupDeleteUx } from './GroupDeleteSection';

export default function GroupDeleteCard({ ux }: { ux: GroupDeleteUx }) {
  return (
    <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
      <div className="text-sm font-semibold text-rose-900">危険な操作</div>
      <div className="mt-1 text-xs text-rose-800">
        グループを削除すると元に戻せません。
      </div>

      {ux.error ? (
        <div className="mt-3 rounded-lg border border-rose-200 bg-white p-2 text-sm text-rose-700">
          {ux.error}
        </div>
      ) : null}

      <form
        action={ux.formAction}
        onSubmit={(e) => {
          const ok = window.confirm(
            'グループを削除します。取り消せません。よろしいですか？',
          );
          if (!ok) e.preventDefault();
        }}
      >
        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          disabled={ux.isDeleting}
        >
          {ux.isDeleting ? '削除中…' : 'このグループを削除'}
        </button>
      </form>
    </section>
  );
}
