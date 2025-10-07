import { z } from "zod";
import { PrivacySettingSchema } from "../../schemas/privacy-setting.schema";

export const PostResourceSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
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

export type PostResource = z.infer<typeof PostResourceSchema>;
