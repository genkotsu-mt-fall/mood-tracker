import { z } from 'zod';

export const groupMemberCreateSchema = z.object({
  groupId: z.uuid(),
  memberId: z.uuid(),
});
