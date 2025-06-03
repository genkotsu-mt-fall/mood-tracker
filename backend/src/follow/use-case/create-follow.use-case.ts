import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from '../dto/create_follow.dto';
import { FollowEntity } from '../entity/follow.entity';
import { FollowRepository } from '../repository/follow.repository';
import { FindFollowRelationUseCase } from './find-follow-relation.usecase';

@Injectable()
export class CreateFollowUseCase {
  constructor(
    private readonly followRepo: FollowRepository,
    private readonly findFollowRelationUseCase: FindFollowRelationUseCase,
  ) {}

  async execute(userId: string, dto: CreateFollowDto): Promise<FollowEntity> {
    const followeeId = dto.followeeId;
    if (userId === followeeId) {
      throw new BadRequestException('自分をフォローすることはできません');
    }

    const exist = await this.findFollowRelationUseCase.execute(
      userId,
      followeeId,
    );
    if (exist) {
      throw new BadRequestException('すでにこのユーザーをフォローしています');
    }

    return await this.followRepo.create(userId, dto);
  }
}
