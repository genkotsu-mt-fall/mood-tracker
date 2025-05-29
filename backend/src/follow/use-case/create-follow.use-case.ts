import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from '../dto/create_follow.dto';
import { FollowEntity } from '../entity/follow.entity';
import { FollowRepository } from '../repository/follow.repository';

@Injectable()
export class CreateFollowUseCase {
  constructor(private readonly followRepo: FollowRepository) {}

  async execute(userId: string, dto: CreateFollowDto): Promise<FollowEntity> {
    if (userId === dto.followeeId) {
      throw new BadRequestException('自分をフォローすることはできません');
    }

    const exist = await this.followRepo.findFollowRelation(
      userId,
      dto.followeeId,
    );
    if (exist) {
      throw new BadRequestException('すでにこのユーザーをフォローしています');
    }

    return await this.followRepo.create(userId, dto);
  }
}
