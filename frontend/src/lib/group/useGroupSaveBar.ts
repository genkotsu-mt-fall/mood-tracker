'use client';

import { useMemo, useState, useCallback } from 'react';
import { useGroupOptions } from '@/lib/group/useGroup';
import { useGroupMembers } from '@/lib/group/useGroupMembers';
import {
  useGroupNameDraft,
  useMembersDraft,
} from '@/components/group-edit/GroupEditProvider';
import type {
  GroupResource,
  UserResource,
} from '@genkotsu-mt-fall/shared/schemas';
import {
  updateGroupClient,
  updateGroupMembersDiffClient,
} from '@/lib/group/client';

function computeMembersDiff(
  baseMembers: UserResource[],
  added: Map<string, UserResource>,
  removed: Set<string>,
) {
  const baseIds = new Set(baseMembers.map((m) => m.id));

  const addedIds = Array.from(added.keys()).filter((id) => !baseIds.has(id));
  const removedIds = Array.from(removed.values()).filter((id) =>
    baseIds.has(id),
  );

  return { addedIds, removedIds };
}

export function useGroupSaveBar(id: string) {
  const nameDraft = useGroupNameDraft();
  const membersDraft = useMembersDraft();

  const groupSWR = useGroupOptions(id);
  const membersSWR = useGroupMembers(id);

  const baseName = groupSWR.data?.name ?? '';

  const EMPTY_MEMBERS: UserResource[] = [];
  const baseMembers = membersSWR.members ?? EMPTY_MEMBERS;

  const nameDirty =
    nameDraft.draftName != null && nameDraft.draftName !== baseName;

  const membersDiff = useMemo(
    () =>
      computeMembersDiff(
        baseMembers,
        membersDraft.addedMembers,
        membersDraft.removedIds,
      ),
    [baseMembers, membersDraft.addedMembers, membersDraft.removedIds],
  );

  const membersDirty =
    membersDiff.addedIds.length > 0 || membersDiff.removedIds.length > 0;

  const dirty = nameDirty || membersDirty;

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    !isSaving &&
    dirty &&
    nameDraft.editable &&
    membersDraft.editable &&
    !groupSWR.isLoading &&
    !membersSWR.isLoading &&
    !groupSWR.error &&
    !membersSWR.error;

  const onSave = useCallback(async () => {
    if (!canSave) return;

    setIsSaving(true);
    setError(null);

    try {
      // 1) グループ名更新（必要なときだけ）
      if (nameDirty) {
        const nextGroup = await updateGroupClient(id, {
          name: (nameDraft.draftName ?? baseName).trim(),
        });

        nameDraft.reset();
        await groupSWR.mutate(nextGroup as GroupResource, false);
      }

      // 2) メンバー差分更新（必要なときだけ）
      if (membersDirty) {
        const nextMembers = await updateGroupMembersDiffClient(id, membersDiff);

        membersDraft.reset();
        await membersSWR.mutate(nextMembers as UserResource[], false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown error';
      setError(msg);
    } finally {
      setIsSaving(false);
      // 再検証は失敗してもUIを壊さない
      await Promise.all([groupSWR.mutate(), membersSWR.mutate()]).catch(
        () => {},
      );
    }
  }, [
    canSave,
    id,
    nameDirty,
    membersDirty,
    nameDraft,
    membersDraft,
    baseName,
    membersDiff,
    groupSWR,
    membersSWR,
  ]);

  return { dirty, canSave, isSaving, error, onSave };
}
