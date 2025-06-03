import { Injectable } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { FollowEntity } from '../entity/follow.entity';

@Injectable()
export class FindFollowRelationUseCase {
  constructor(private readonly followRepo: FollowRepository) {}

  async execute(
    userId: string,
    followeeId: string,
  ): Promise<FollowEntity | null> {
    return await this.followRepo.findFollowRelation(userId, followeeId);
  }
}
