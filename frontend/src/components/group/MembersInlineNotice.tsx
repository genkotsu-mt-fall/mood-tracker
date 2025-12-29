'use client';

import { useMembersDraft } from '@/components/group-edit/GroupEditProvider';

export default function MembersInlineNotice() {
  const editor = useMembersDraft();

  if (!editor.lastAction) return null;
  if (editor.lastAction.kind !== 'remove') return null;

  return (
    <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
      1人削除予定です（{editor.lastAction.label}）
      <button
        type="button"
        className="ml-2 underline"
        onClick={editor.undoLast}
      >
        取り消し
      </button>
    </div>
  );
}
