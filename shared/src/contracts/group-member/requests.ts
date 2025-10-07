import { z } from "zod";

export const GroupMemberCreateBodySchema = z
  .object({
    groupId: z.uuid("groupIdはUUID形式で指定してください。"),
    memberId: z.uuid("memberIdはUUID形式で指定してください。"),
  })
  .strict();
export type GroupMemberCreateBody = z.infer<typeof GroupMemberCreateBodySchema>;
