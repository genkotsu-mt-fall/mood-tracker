import { z } from "zod";

export const GroupMemberResourceSchema = z
  .object({
    id: z.uuid(),
    groupId: z.uuid(),
    memberId: z.uuid(),
    addedAt: z.string().datetime(),
  })
  .strict();
export type GroupMemberResource = z.infer<typeof GroupMemberResourceSchema>;
