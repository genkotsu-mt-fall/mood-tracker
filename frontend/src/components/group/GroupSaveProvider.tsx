'use client';

import { ReactNode, useMemo } from 'react';
import { createStrictContext } from '@/components/shared/createStrictContext';
import { useGroupSaveBar } from '@/lib/group/useGroupSaveBar';

export type GroupSaveApi = {
  dirty: boolean;
  canSave: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: () => Promise<void>;
};

const [GroupSaveContext, useGroupSave] =
  createStrictContext<GroupSaveApi>('GroupSaveContext');

export { useGroupSave };

export function GroupSaveProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const s = useGroupSaveBar(id);

  const value = useMemo<GroupSaveApi>(
    () => ({
      dirty: s.dirty,
      canSave: s.canSave,
      isSaving: s.isSaving,
      error: s.error,
      onSave: s.onSave,
    }),
    [s.dirty, s.canSave, s.isSaving, s.error, s.onSave],
  );

  return (
    <GroupSaveContext.Provider value={value}>
      {children}
    </GroupSaveContext.Provider>
  );
}
