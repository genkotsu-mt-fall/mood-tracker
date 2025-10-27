import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';
import { PostEntity } from '../entity/post.entity';
import { PrivacySetting } from '../type/privacy-setting.type';

type PostWithUser = PrismaPost & {
  user?: Pick<PrismaUser, 'id' | 'name'>;
};

export function toPostEntity(data: PostWithUser): PostEntity {
  return new PostEntity({
    id: data.id,
    userId: data.userId,
    author: data.user
      ? { id: data.user.id, name: data.user.name ?? undefined }
      : undefined,
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
