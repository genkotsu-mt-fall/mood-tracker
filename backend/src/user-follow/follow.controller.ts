import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateFollowDto } from 'src/follow/dto/create_follow.dto';
import { FollowResponseDto } from 'src/follow/dto/follow_response.dto';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';

@Controller('follow')
export class FollowController {
  constructor(private readonly createFollowUseCase: CreateFollowUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiEndpoint({
    summary: 'Create a follow',
    description:
      'Authenticated user follows another user. Returns the created follow relation.',
    body: CreateFollowDto,
    response: {
      type: FollowResponseDto,
      kind: ResponseKind.Created,
      description: 'Follow created successfully',
    },
    auth: true,
    errors: {
      unauthorized: true, // 未認証
      badRequest: true, // 自分をフォロー・重複フォローなど
      notFound: true, // フォロー対象ユーザーが存在しない
    },
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateFollowDto,
  ): Promise<ApiResponse<FollowResponseDto>> {
    const result = await this.createFollowUseCase.execute(req.user.id, dto);
    return { success: true, data: new FollowResponseDto(result) };
  }
}
