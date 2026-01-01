import { z } from "zod";

// bio はまだ無いので name のみ
export const MyProfileUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1).max(50),
  })
  .strict();

export type MyProfileUpdateBody = z.infer<typeof MyProfileUpdateBodySchema>;
