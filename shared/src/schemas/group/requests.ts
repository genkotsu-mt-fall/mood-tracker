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

// 追加: グループ名更新
export const GroupUpdateBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "グループ名を入力してください。")
      .max(50, "グループ名は50文字以内です。"),
  })
  .strict();
export type GroupUpdateBody = z.infer<typeof GroupUpdateBodySchema>;

// 追加: メンバー差分更新
export const GroupMembersDiffBodySchema = z
  .object({
    addedIds: z.array(z.string().min(1)),
    removedIds: z.array(z.string().min(1)),
  })
  .strict();
export type GroupMembersDiffBody = z.infer<typeof GroupMembersDiffBodySchema>;
