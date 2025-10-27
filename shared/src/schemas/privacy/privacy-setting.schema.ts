import { z } from "zod";
// import { PrivacySetting } from '../type/privacy-setting.type';
// import { BadRequestException } from '@nestjs/common';

const hhmmRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeRangeSchema = z.string().refine((val) => hhmmRegex.test(val), {
  message: '時間は HH:mm 形式で指定してください。(例: "08:00")',
});

export const PrivacySettingSchema = z
  .object({
    // visibility: z.enum(['custom', 'public']),
    allow_users: z.array(z.uuid()).nonempty(),
    deny_users: z.array(z.uuid()).nonempty(),
    allow_groups: z.array(z.uuid()).nonempty(),
    group_visibility_mode: z.enum(["any", "all"]),
    followers_only: z.boolean(),
    follow_back_only: z.boolean(),
    min_follow_days: z.number().int().nonnegative(),
    max_follow_days: z.number().int().nonnegative(),
    viewable_time_range: z.object({
      start: timeRangeSchema,
      end: timeRangeSchema,
    }),
    visible_until: z
      .string()
      .datetime()
      .refine((val) => new Date(val) > new Date(), {
        message:
          "visible_until は過去の日付ではなく、将来の日付を指定してください",
      }),
    visible_after: z.string().datetime(),
    comment_activity_filter: z.object({
      within_days: z.number().int().nonnegative().optional(),
      min_comments: z.number().int().nonnegative().optional(),
    }),
    device_types: z.array(z.enum(["mobile", "desktop"])),
  })
  .partial()
  .strict()
  .superRefine((data, ctx) => {
    const { min_follow_days, max_follow_days } = data;
    if (min_follow_days === undefined || max_follow_days === undefined) return;
    if (min_follow_days > max_follow_days) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["min_follow_days"],
        message: "min_follow_days は max_follow_days 以下を指定してください",
      });
    }
  });

export type PrivacySetting = z.infer<typeof PrivacySettingSchema>;

// export function validatePrivacySetting(
//   input: unknown
// ): PrivacySetting | undefined {
//   if (input === undefined) return undefined;
//   const result = PrivacySettingSchema.safeParse(input);
//   if (!result.success) {
//     const zodErrorMessage = result.error.issues[0]?.message;
//     throw new BadRequestException(
//       zodErrorMessage || "privacyJson の構造が正しくありません。"
//     );
//   }
//   return result.data;
// }
