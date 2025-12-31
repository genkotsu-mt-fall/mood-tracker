import { z } from "zod";

/**
 * backend FollowResponseDto に対応
 * - followedAt は JSON では ISO 文字列になる想定なので string.datetime()
 */
export const FollowResourceSchema = z
  .object({
    id: z.uuid(),
    followerId: z.uuid(),
    followeeId: z.uuid(),
    followedAt: z.string().datetime(),
  })
  .strict();

export type FollowResource = z.infer<typeof FollowResourceSchema>;
