import { z } from "zod";
import { UserResourceSchema } from "../user/resource";

export const MyProfileResponseSchema = z
  .object({
    profile: UserResourceSchema,
    followersCount: z.number().int().nonnegative(),
    followingCount: z.number().int().nonnegative(),
  })
  .strict();

export type MyProfileResponse = z.infer<typeof MyProfileResponseSchema>;
