'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { KeyedMutator } from 'swr';

import { updateMyProfileClient } from '@/lib/me/client';
import { MyProfileResponse } from '@genkotsu-mt-fall/shared/schemas';

export function useSettingsProfileCard({
  data,
  mutate,
}: {
  data?: MyProfileResponse;
  mutate: KeyedMutator<MyProfileResponse>;
}) {
  // baseName は data から導出（未取得なら空文字）
  const baseName = useMemo(() => data?.profile?.name ?? '', [data]);

  // draft は base と同じなら null（= dirty 解消）
  const [draftName, setDraftName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // data が更新されて baseName が変わった結果、draft が base と一致したら draft を消す
  useEffect(() => {
    if (draftName === null) return;
    if (draftName === baseName) setDraftName(null);
  }, [baseName, draftName]);

  const name = draftName ?? baseName;
  const dirty = draftName !== null;

  const trimmed = useMemo(() => name.trim(), [name]);

  const saveDisabled = useMemo(() => {
    if (isSaving) return true;
    if (!dirty) return true;
    if (trimmed.length === 0) return true;
    return false;
  }, [isSaving, dirty, trimmed]);

  const onNameChange = useCallback(
    (v: string) => {
      setDraftName(v === baseName ? null : v);
    },
    [baseName],
  );

  const onSave = useCallback(async () => {
    if (saveDisabled) return;

    setIsSaving(true);
    try {
      const next = await updateMyProfileClient({ name: trimmed });

      // SWR キャッシュ差し替え（revalidate しない）
      await mutate(next, false);

      // dirty 解消
      setDraftName(null);

      toast.success('プロフィールを更新しました');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '更新に失敗しました';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [saveDisabled, trimmed, mutate]);

  return {
    name,
    onNameChange,
    editable: !isSaving,
    dirty,
    isSaving,
    onSave,
    saveDisabled,
  };
}
