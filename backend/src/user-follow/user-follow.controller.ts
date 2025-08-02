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

@Controller('user')
export class UserFollowController {
  constructor(
    private readonly findFollowersByUserIdUseCase: FindFollowersByUserIdUseCase,
    private readonly findFollowingByUserIdUseCase: FindFollowingByUserIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/followers')
  async getFollowers(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto[]> {
    const followers = await this.findFollowersByUserIdUseCase.execute(id);
    return followers.map((user) => new UserResponseDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/following')
  async getFollowing(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto[]> {
    const following = await this.findFollowingByUserIdUseCase.execute(id);
    return following.map((user) => new UserResponseDto(user));
  }
}
