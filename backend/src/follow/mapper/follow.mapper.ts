import { Follow as PrismaFollow } from '@prisma/client';
import { FollowEntity } from '../entity/follow.entity';

export function toFollowEntity(data: PrismaFollow): FollowEntity {
  return new FollowEntity(
    data.id,
    data.follower_id,
    data.followee_id,
    data.followed_at,
  );
}
