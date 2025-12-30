'use server';

import { redirect } from 'next/navigation';
import { deleteGroupUsecase } from '@/lib/bff/group/deleteGroup.usecase';

export type DeleteGroupState = { ok: true } | { ok: false; message: string };

export async function deleteGroupAndRedirectAction(
  groupId: string,
): Promise<DeleteGroupState> {
  console.log('deleteGroupAndRedirectAction', { groupId });

  const res = await deleteGroupUsecase(groupId);
  if (!res.ok) {
    return {
      ok: false,
      message: res.message ?? 'グループ削除に失敗しました。',
    };
  }

  redirect('/groups');
}
