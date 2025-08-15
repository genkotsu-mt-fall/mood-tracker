import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { FindFollowersByUserIdUseCase } from './use-case/find-followers-by-user-id.use-case';
import { FindFollowingByUserIdUseCase } from './use-case/find-following-by-user-id.use-case';
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';

@Controller('user')
export class UserFollowController {
  constructor(
    private readonly findFollowersByUserIdUseCase: FindFollowersByUserIdUseCase,
    private readonly findFollowingByUserIdUseCase: FindFollowingByUserIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/followers')
  @ApiEndpoint({
    summary: 'Get followers of a user',
    description: 'Retrieve a list of users who follow the specified user.',
    response: {
      type: UserResponseDto,
      description: 'Followers retrieved successfully',
      isArray: true,
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'User' },
    errors: { unauthorized: true, notFound: true },
  })
  async getFollowers(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const followers = await this.findFollowersByUserIdUseCase.execute(id);
    return {
      success: true,
      data: followers.map((user) => new UserResponseDto(user)),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/following')
  @ApiEndpoint({
    summary: 'Get users followed by a user',
    description:
      'Retrieve a list of users that the specified user is following.',
    response: {
      type: UserResponseDto,
      description: 'Following users retrieved successfully',
      isArray: true,
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'User' },
    errors: { unauthorized: true, notFound: true },
  })
  async getFollowing(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const following = await this.findFollowingByUserIdUseCase.execute(id);
    return {
      success: true,
      data: following.map((user) => new UserResponseDto(user)),
    };
  }
}
