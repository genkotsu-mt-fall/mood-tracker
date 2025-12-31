import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMessage } from 'src/common/errors/error.messages';
import { FollowRepository } from 'src/follow/repository/follow.repository';
import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';

@Injectable()
export class DeleteFollowByFolloweeUseCase {
  constructor(
    private readonly followRepo: FollowRepository,
    private readonly findFollowRelationUseCase: FindFollowRelationUseCase,
  ) {}

  async execute(userId: string, followeeId: string): Promise<void> {
    if (userId === followeeId) {
      throw new BadRequestException('自分をフォロー解除することはできません');
    }

    const item = await this.findFollowRelationUseCase.execute(
      userId,
      followeeId,
    );
    if (!item) {
      throw new NotFoundException(
        ErrorMessage.FollowNotFoundByPair(userId, followeeId),
      );
    }

    await this.followRepo.deleteByFolloweeId(userId, followeeId);
  }
}
