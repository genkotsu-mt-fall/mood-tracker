import { Injectable } from '@nestjs/common';
import { FollowRepository } from 'src/follow/repository/follow.repository';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindUserByIdUseCase } from 'src/user/use-case/find-user-by-id.use-case';

@Injectable()
export class FindFollowingByUserIdUseCase {
  constructor(
    private readonly followRepo: FollowRepository,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  async execute(userId: string): Promise<UserEntity[]> {
    await this.findUserByIdUseCase.execute(userId);
    return await this.followRepo.findFollowingByUserId(userId);
  }
}
