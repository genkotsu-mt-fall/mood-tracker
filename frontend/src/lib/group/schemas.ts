import z from 'zod';

export const groupCreateSchema = z.object({
  name: z
    .string({ error: 'グループ名を入力してください' })
    .trim()
    .min(1, 'グループ名を入力してください')
    .max(50, 'グループ名は50文字以内で入力してください'),
});

export type GroupCreateData = z.infer<typeof groupCreateSchema>;
