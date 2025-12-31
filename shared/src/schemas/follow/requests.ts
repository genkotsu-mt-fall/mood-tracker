import { z } from "zod";

// Body: POST /follow
export const FollowCreateBodySchema = z
  .object({
    followeeId: z.uuid(),
  })
  .strict();

export type FollowCreateBody = z.infer<typeof FollowCreateBodySchema>;
