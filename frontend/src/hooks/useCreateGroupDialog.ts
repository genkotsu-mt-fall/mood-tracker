'use client';

import { useCallback, useRef, useState } from 'react';
import type { Option } from '@/lib/common/types';

type UseCreateGroupDialogParams = {
  /** 実際の作成処理。成功時 Option を返す（APIに置き換え可） */
  onCreate: (name: string, userIds: string[]) => Promise<Option> | Option;
  getSelectedUserIds?: () => string[];
};

export function useCreateGroupDialog(params: UseCreateGroupDialogParams) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // PrivacyEditor に結果を返す Promise の resolver
  const resolverRef = useRef<((opt?: Option) => void) | null>(null);

  /** PrivacyEditor から呼ばれる：ダイアログを開き、結果を Promise で返す */
  const requestCreateGroup = useCallback(() => {
    return new Promise<Option | void>((resolve) => {
      resolverRef.current = resolve;
      setError('');
      setName('');
      setOpen(true);
    });
  }, []);

  /** 作成ボタン */
  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('グループ名を入力してください');
      return;
    }
    try {
      setSubmitting(true);
      const userIds = params.getSelectedUserIds?.() || [];
      const created = await params.onCreate(trimmed, userIds);
      // 正常作成 → ダイアログを閉じ、呼び出し元へ返す
      setOpen(false);
      resolverRef.current?.(created);
    } catch (e) {
      setError('作成に失敗しました。時間を置いて再度お試しください。');
      return;
    } finally {
      setSubmitting(false);
      resolverRef.current = null;
    }
  }, [name, params]);

  /** キャンセル/クローズ */
  const handleClose = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(); // undefined 返却（キャンセル扱い）
    resolverRef.current = null;
  }, []);

  /** onCreate を動的に差し替えたい場合（任意） */
  const attachCreator = useCallback(
    (creator: (name: string) => Promise<Option> | Option) => {
      params.onCreate = creator;
    },
    [params],
  );

  return {
    open,
    setOpen,
    name,
    setName,
    error,
    setError,
    submitting,
    requestCreateGroup,
    handleSubmit,
    handleClose,
    attachCreator,
  };
}
