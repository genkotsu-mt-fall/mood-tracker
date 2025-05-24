import { z } from 'zod';
// import { PrivacySetting } from '../type/privacy-setting.type';
import { BadRequestException } from '@nestjs/common';

export const PrivacySettingSchema = z
  .object({
    visibility: z.enum(['custom', 'public', 'followers']),
    allow_users: z.array(z.string()),
    deny_users: z.array(z.string()),
    allow_groups: z.array(z.string()),
    group_visibility_mode: z.enum(['any', 'all']),
    followers_only: z.boolean(),
    follow_back_only: z.boolean(),
    min_follow_days: z.number().int(),
    max_follow_days: z.number().int(),
    viewable_time_range: z.object({
      start: z.string(),
      end: z.string(),
    }),
    visible_until: z.string(),
    visible_after: z.string(),
    comment_activity_filter: z.object({
      within_days: z.number().int(),
      min_comments: z.number().int(),
    }),
    device_types: z.array(z.enum(['mobile', 'desktop'])),
  })
  .partial()
  .strict();

export type PrivacySetting = z.infer<typeof PrivacySettingSchema>;

export function validatePrivacySetting(
  input: unknown,
): PrivacySetting | undefined {
  if (input === undefined) return undefined;
  const result = PrivacySettingSchema.safeParse(input);
  if (!result.success) {
    throw new BadRequestException('privacyJson の構造が正しくありません。');
  }
  return result.data;
}
