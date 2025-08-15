import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindFollowersByUserIdUseCase } from './use-case/find-followers-by-user-id.use-case';
import { FindFollowingByUserIdUseCase } from './use-case/find-following-by-user-id.use-case';
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';

@Controller('auth')
export class MeFollowController {
  constructor(
    private readonly findFollowersByUserIdUseCase: FindFollowersByUserIdUseCase,
    private readonly findFollowingByUserIdUseCase: FindFollowingByUserIdUseCase,
  ) {}

  @Get('me/followers')
  @UseGuards(JwtAuthGuard)
  @ApiEndpoint({
    summary: 'Get my followers',
    description: 'Retrieve a list of users who follow the authenticated user.',
    response: {
      type: UserResponseDto,
      description: 'Followers retrieved successfully',
      isArray: true,
    },
    auth: true,
    errors: { unauthorized: true, notFound: true },
  })
  async getFollowers(
    @CurrentUser() user: UserEntity,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const followers = await this.findFollowersByUserIdUseCase.execute(user.id);
    return {
      success: true,
      data: followers.map((follower) => new UserResponseDto(follower)),
    };
  }

  @Get('me/following')
  @UseGuards(JwtAuthGuard)
  @ApiEndpoint({
    summary: 'Get users I follow',
    description:
      'Retrieve a list of users that the authenticated user is following.',
    response: {
      type: UserResponseDto,
      description: 'Following users retrieved successfully',
      isArray: true,
    },
    auth: true,
    errors: { unauthorized: true, notFound: true },
  })
  async getFollowing(
    @CurrentUser() user: UserEntity,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const following = await this.findFollowingByUserIdUseCase.execute(user.id);
    return {
      success: true,
      data: following.map((followed) => new UserResponseDto(followed)),
    };
  }
}
