'use client';

import { useGroupSave } from '@/components/group/GroupSaveProvider';
import { Button } from '../ui/button';

export default function GroupSaveBar() {
  const { dirty, canSave, isSaving, error, onSave } = useGroupSave();

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {dirty ? '未保存の変更があります' : '変更はありません'}
        </div>

        <Button disabled={!canSave} onClick={onSave}>
          {isSaving ? '保存中…' : '保存'}
        </Button>
      </div>

      {error ? (
        <div className="mt-2 text-sm text-rose-700">
          保存に失敗しました：{error}
        </div>
      ) : null}
    </div>
  );
}
