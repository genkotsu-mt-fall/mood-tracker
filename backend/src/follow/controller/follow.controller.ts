import {
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FindFollowByIdUseCase } from '../use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from '../use-case/delete-follow.use-case';
import { FollowResponseDto } from '../dto/follow_response.dto';
import { FollowOwnerGuard } from '../guard/follow-owner.guard';
import { ApiResponse } from 'src/common/response/api-response';
import { MessageDto } from 'src/common/dto/message.dto';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';

@Controller('follow')
export class FollowController {
  constructor(
    private readonly findFollowByIdUseCase: FindFollowByIdUseCase,
    private readonly deleteFollowUseCase: DeleteFollowUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiEndpoint({
    summary: 'Get follow by ID',
    description: 'Retrieve a follow relationship by its ID',
    response: {
      type: FollowResponseDto,
      kind: ResponseKind.Ok,
      description: 'Follow retrieved successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Follow' },
    errors: { unauthorized: true, notFound: true },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<FollowResponseDto>> {
    const result = await this.findFollowByIdUseCase.execute(id);
    return { success: true, data: new FollowResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, FollowOwnerGuard)
  @Delete(':id')
  @ApiEndpoint({
    summary: 'Delete follow by ID',
    description: 'Delete a follow relationship by its ID',
    response: {
      type: MessageDto,
      kind: ResponseKind.Ok,
      description: 'Follow deleted successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Follow' },
    errors: { unauthorized: true, notFound: true },
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<MessageDto>> {
    await this.deleteFollowUseCase.execute(id);
    return { success: true, data: { message: 'Follow deleted successfully' } };
  }
}
