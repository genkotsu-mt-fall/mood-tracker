import z from 'zod';
import { isSingleEmojiIntl } from '../emoji/single';
import { PrivacySettingSchema } from '@/lib/privacy/types';

export const composeSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { message: '本文を入力してください。' })
    .max(280, { message: '280文字以内で入力してください。' }),

  emoji: z.preprocess((val) => {
    if (typeof val === 'string') {
      const s = val.trim();
      if (!s) return undefined;
      return s;
    }
    return val ?? undefined;
  }, z.string().refine(isSingleEmojiIntl, '絵文字は1文字だけにしてください。').optional()),

  intensity: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : val,
    z.coerce.number().int().min(0).max(100).optional(),
  ),

  crisisFlag: z.boolean().default(false),
});

export const postCreateSchema = composeSchema
  .extend({
    privacyJson: PrivacySettingSchema.optional(),
  })
  .strict();

export type ComposeFields = z.infer<typeof composeSchema>;
export type PostCreateInput = z.infer<typeof postCreateSchema>;
