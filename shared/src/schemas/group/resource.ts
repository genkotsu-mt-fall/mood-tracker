import { z } from "zod";

export const GroupResourceSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1).max(50),
    userId: z.uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type GroupResource = z.infer<typeof GroupResourceSchema>;
