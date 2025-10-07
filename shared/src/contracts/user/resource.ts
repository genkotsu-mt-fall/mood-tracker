import { z } from "zod";

export const UserResourceSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    name: z.string().nullable().optional(),
  })
  .strict();

export type UserResource = z.infer<typeof UserResourceSchema>;
