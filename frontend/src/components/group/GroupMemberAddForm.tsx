'use client';

export default function GroupMemberAddForm({
  disabled = true,
  onAdd,
}: {
  disabled?: boolean;
  onAdd?: (userId: string) => void;
}) {
  return (
    <div className="mt-3 flex gap-2">
      <input
        className="flex-1 rounded-md border px-2 py-1 text-sm"
        placeholder="ユーザーID"
        disabled={disabled}
        // 実装時は useState で値保持して onAdd へ渡す
      />
      <button
        disabled={disabled}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-60"
      >
        追加
      </button>
    </div>
  );
}
