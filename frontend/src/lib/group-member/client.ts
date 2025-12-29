import { bffPost, unwrapOrThrow } from '@/lib/bff/request';
import z from 'zod';

export async function createGroupMemberClient(
  groupId: string,
  memberIds: string[],
): Promise<void> {
  for (const memberId of memberIds) {
    const r = await bffPost(
      '/api/group-member',
      { groupId, memberId },
      z.unknown(),
    );
    unwrapOrThrow(r);
  }
}
