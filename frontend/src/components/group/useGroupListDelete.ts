'use client';

import { useCallback, useState } from 'react';

export type UseGroupListDeleteOptions = {
  onDelete: (groupId: string) => Promise<void>;
};

export type GroupListDeleteApi = {
  deletingId: string | null;
  error: string | null;
  requestDelete: (groupId: string, groupName: string) => Promise<void>;
};

export function useGroupListDelete(
  opts: UseGroupListDeleteOptions,
): GroupListDeleteApi {
  const { onDelete } = opts;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestDelete = useCallback(
    async (groupId: string, groupName: string) => {
      setError(null);

      const ok = window.confirm(
        `「${groupName}」を削除します。\nこの操作は取り消せません。よろしいですか？`,
      );
      if (!ok) return;

      try {
        setDeletingId(groupId);
        await onDelete(groupId);
      } catch (e) {
        setError(e instanceof Error ? e.message : '削除に失敗しました。');
      } finally {
        setDeletingId(null);
      }
    },
    [onDelete],
  );

  return { deletingId, error, requestDelete };
}
