import { z } from "zod";

// Body
export const GroupCreateBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "グループ名を入力してください。")
      .max(50, "グループ名は50文字以内です。"),
  })
  .strict();
export type GroupCreateBody = z.infer<typeof GroupCreateBodySchema>;
