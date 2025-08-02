import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindFollowersByUserIdUseCase } from './use-case/find-followers-by-user-id.use-case';
import { FindFollowingByUserIdUseCase } from './use-case/find-following-by-user-id.use-case';

@Controller('auth')
export class MeFollowController {
  constructor(
    private readonly findFollowersByUserIdUseCase: FindFollowersByUserIdUseCase,
    private readonly findFollowingByUserIdUseCase: FindFollowingByUserIdUseCase,
  ) {}

  @Get('me/followers')
  @UseGuards(JwtAuthGuard)
  async getFollowers(
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseDto[]> {
    const followers = await this.findFollowersByUserIdUseCase.execute(user.id);
    return followers.map((follower) => new UserResponseDto(follower));
  }

  @Get('me/following')
  @UseGuards(JwtAuthGuard)
  async getFollowing(
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseDto[]> {
    const following = await this.findFollowingByUserIdUseCase.execute(user.id);
    return following.map((followed) => new UserResponseDto(followed));
  }
}
