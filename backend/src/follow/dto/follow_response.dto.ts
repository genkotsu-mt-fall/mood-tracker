import { FollowEntity } from '../entity/follow.entity';

export class FollowResponseDto {
  constructor(entity: FollowEntity) {
    this.id = entity.id;
    this.followerId = entity.followerId;
    this.followeeId = entity.followeeId;
    this.followedAt = entity.followedAt;
  }

  id: string;
  followerId: string;
  followeeId: string;
  followedAt: Date;
}
