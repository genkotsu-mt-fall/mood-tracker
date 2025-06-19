import { Post as PrismaPost } from '@prisma/client';
import { PostEntity } from '../entity/post.entity';
import { PrivacySetting } from '../type/privacy-setting.type';

export function toPostEntity(data: PrismaPost): PostEntity {
  return new PostEntity({
    id: data.id,
    userId: data.userId,
    body: data.body,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    crisisFlag: data.crisisFlag ?? false,
    mood: data.mood ?? undefined,
    intensity: data.intensity ?? undefined,
    emoji: data.emoji ?? undefined,
    templateId: data.templateId ?? undefined,
    privacyJson: (data.privacyJson as PrivacySetting) ?? undefined,
  });
}
