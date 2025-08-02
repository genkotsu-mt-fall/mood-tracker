import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from '../../follow/dto/create_follow.dto';
import { FollowEntity } from '../../follow/entity/follow.entity';
import { FollowRepository } from '../../follow/repository/follow.repository';
import { FindFollowRelationUseCase } from '../../follow/use-case/find-follow-relation.usecase';
import { FindUserByIdUseCase } from 'src/user/use-case/find-user-by-id.use-case';

@Injectable()
export class CreateFollowUseCase {
  constructor(
    private readonly followRepo: FollowRepository,
    private readonly findFollowRelationUseCase: FindFollowRelationUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  async execute(userId: string, dto: CreateFollowDto): Promise<FollowEntity> {
    const followeeId = dto.followeeId;
    if (userId === followeeId) {
      throw new BadRequestException('自分をフォローすることはできません');
    }

    // フォロー相手が存在しない場合は NotFoundException を投げる（ユースケース内部で対応）
    await this.findUserByIdUseCase.execute(followeeId);

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
