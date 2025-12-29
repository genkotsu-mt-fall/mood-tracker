'use client';

import { EditableField } from '@/components/editable/EditableField';

export default function GroupTitleCard({
  name,
  onNameChange,
  editable = false,
}: {
  name: string;
  onNameChange?: (value: string) => void;
  editable?: boolean;
}) {
  // onNameChangeが無いなら、編集開始できても値が変わらずUXが壊れるので編集不可扱いにする
  const canEdit = editable && !!onNameChange;

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3">
      <label className="block text-xs text-gray-500">グループ名</label>

      <EditableField
        editable={canEdit}
        value={name}
        onChange={(v) => onNameChange?.(v)}
        // 方針: blurで編集終了（デフォルトtrueだが明示してもOK）
        commitOnBlur
      >
        {({ fieldProps, showEditAffordance, editButtonProps, hint }) => (
          <>
            <div className="relative mt-1">
              <input
                {...fieldProps}
                className="w-full rounded-md border px-2 py-1 pr-16 text-sm"
              />
              {showEditAffordance ? (
                <button
                  {...editButtonProps}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                >
                  編集
                </button>
              ) : null}
            </div>

            <div className="mt-2 text-right text-xs text-gray-500">{hint}</div>
          </>
        )}
      </EditableField>
    </div>
  );
}
