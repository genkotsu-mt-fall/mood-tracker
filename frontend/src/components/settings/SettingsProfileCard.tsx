'use client';

import { EditableField } from '@/components/editable/EditableField';

export default function SettingsProfileCard({
  name,
  bio,
  onNameChange,
  editable = false,
  dirty = false,
  isSaving = false,
  onSave,
  saveDisabled = true,
}: {
  name: string;
  bio: string;
  onNameChange?: (value: string) => void;
  editable?: boolean;

  dirty?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
}) {
  // onNameChange が無いなら編集不可（UX 破壊防止）
  const canEdit = editable && !!onNameChange;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <label className="block text-xs text-gray-500">名前</label>

        <EditableField
          editable={canEdit}
          value={name}
          onChange={(v) => onNameChange?.(v)}
          commitOnBlur
        >
          {({ fieldProps, showEditAffordance, editButtonProps, hint }) => (
            <>
              <div className="relative mt-1">
                <input
                  {...fieldProps}
                  className="w-full rounded-md border px-2 py-1 pr-16 text-sm"
                  placeholder="名前を入力"
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

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{hint}</span>
                <span>
                  {dirty ? '未保存の変更があります' : '変更はありません'}
                </span>
              </div>
            </>
          )}
        </EditableField>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <label className="block text-xs text-gray-500">自己紹介</label>
        <textarea
          className="mt-1 h-24 w-full rounded-md border p-2 text-sm"
          value={bio}
          disabled
        />
        <p className="mt-1 text-xs text-gray-500">
          bio は DB カラム未追加のため、保存対象外です
        </p>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saveDisabled || !onSave}
        className={`rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white ${
          saveDisabled || !onSave ? 'opacity-60' : ''
        }`}
      >
        {isSaving ? '保存中…' : '保存'}
      </button>
    </div>
  );
}
