import { Post as PrismaPost } from '@prisma/client';
import { PostEntity } from '../entity/post.entity';
import { PrivacySetting } from '../type/privacy-setting.type';

export function toPostEntity(data: PrismaPost): PostEntity {
  return new PostEntity(
    data.id,
    data.userId,
    data.mood,
    data.intensity,
    data.body,
    data.emoji,
    data.templateId,
    data.privacyJson as PrivacySetting | null,
    data.crisisFlag,
    data.createdAt,
    data.updatedAt,
  );
}
