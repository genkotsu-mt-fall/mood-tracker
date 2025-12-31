import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateFollowDto } from 'src/follow/dto/create_follow.dto';
import { FollowResponseDto } from 'src/follow/dto/follow_response.dto';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';
import { MessageDto } from 'src/common/dto/message.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { DeleteFollowByFolloweeUseCase } from './use-case/delete-follow-by-followee.use-case';

@Controller('follow')
export class FollowController {
  private readonly logger = new Logger(FollowController.name);

  constructor(
    private readonly createFollowUseCase: CreateFollowUseCase,
    private readonly deleteFollowByFolloweeUseCase: DeleteFollowByFolloweeUseCase,
  ) {}

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
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateFollowDto,
  ): Promise<ApiResponse<FollowResponseDto>> {
    const result = await this.createFollowUseCase.execute(user.id, dto);
    return { success: true, data: new FollowResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('followee/:followeeId')
  @ApiEndpoint({
    summary: 'Delete follow by followeeId',
    description:
      'Authenticated user unfollows a followee specified by userId (followeeId).',
    response: {
      type: MessageDto,
      kind: ResponseKind.Ok,
      description: 'Follow deleted successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Followee user' },
    errors: { unauthorized: true, notFound: true },
  })
  async removeByFollowee(
    @CurrentUser() user: UserEntity,
    @Param('followeeId', new ParseUUIDPipe({ version: '4' }))
    followeeId: string,
  ): Promise<ApiResponse<MessageDto>> {
    this.logger.log(`User ${user.id} is unfollowing user ${followeeId}`);
    await this.deleteFollowByFolloweeUseCase.execute(user.id, followeeId);
    return { success: true, data: { message: 'Follow deleted successfully' } };
  }
}
