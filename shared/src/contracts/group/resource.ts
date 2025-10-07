import { z } from "zod";

export const GroupResourceSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1).max(50),
  })
  .strict();

export type GroupResource = z.infer<typeof GroupResourceSchema>;
