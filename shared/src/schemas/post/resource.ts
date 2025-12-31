import { z } from "zod";
import { PrivacySettingSchema } from "../privacy/privacy-setting.schema";

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
});

export const PostResourceSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    author: AuthorSchema.optional(),
    body: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    crisisFlag: z.boolean(),
    mood: z.string().optional(),
    intensity: z.number().int().min(0).max(100).optional(),
    emoji: z.string().optional(),
    templateId: z.uuid().optional(),
    privacyJson: PrivacySettingSchema.optional(),
  })
  .strict();

export const PostResourceWithIsMeSchema = PostResourceSchema.extend({
  isMe: z.boolean(),
});

export type PostResource = z.infer<typeof PostResourceSchema>;
export type PostResourceWithIsMe = z.infer<typeof PostResourceWithIsMeSchema>;
