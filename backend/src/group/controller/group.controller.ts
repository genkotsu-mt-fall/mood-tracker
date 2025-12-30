import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { CreateGroupUseCase } from '../use-case/create-group.use-case';
import { FindGroupByIdUseCase } from '../use-case/find-group-by-id.use-case';
import { UpdateGroupUseCase } from '../use-case/update-group.use-case';
import { DeleteGroupUseCase } from '../use-case/delete-group.use-case';
import { GroupResponseDto } from '../dto/group_response.dto';
import { GroupOwnerGuard } from '../guard/group-owner.guard';
import { ApiResponse } from 'src/common/response/api-response';
import { MessageDto } from 'src/common/dto/message.dto';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';
import { ApiErrorWrapped } from 'src/common/swagger/errors/error.decorators';

@Controller('group')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly findGroupByIdUseCase: FindGroupByIdUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiEndpoint({
    summary: 'Create a new group',
    description: 'Allows users to create a new group',
    body: CreateGroupDto,
    response: {
      type: GroupResponseDto,
      kind: ResponseKind.Created,
      description: 'Group created successfully',
    },
    auth: true,
  })
  @ApiErrorWrapped(401, 'Unauthorized')
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGroupDto,
  ): Promise<ApiResponse<GroupResponseDto>> {
    const result = await this.createGroupUseCase.execute(req.user.id, dto);
    return { success: true, data: new GroupResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, GroupOwnerGuard)
  @Get(':id')
  @ApiEndpoint({
    summary: 'Get a group by ID',
    description: 'Fetches a group by its unique identifier',
    response: {
      type: GroupResponseDto,
      description: 'Group retrieved successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group' },
    errors: { unauthorized: true, notFound: true },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<GroupResponseDto>> {
    const result = await this.findGroupByIdUseCase.execute(id);
    return { success: true, data: new GroupResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, GroupOwnerGuard)
  @Put(':id')
  @ApiEndpoint({
    summary: 'Update a group',
    description: 'Allows users to update an existing group',
    body: UpdateGroupDto,
    response: {
      type: GroupResponseDto,
      description: 'Group updated successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group' },
    errors: { unauthorized: true, notFound: true },
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<ApiResponse<GroupResponseDto>> {
    const result = await this.updateGroupUseCase.execute(id, dto);
    return { success: true, data: new GroupResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, GroupOwnerGuard)
  @Delete(':id')
  @ApiEndpoint({
    summary: 'Delete a group',
    description: 'Allows users to delete an existing group',
    response: {
      type: MessageDto,
      description: 'Group deleted successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group' },
    errors: { unauthorized: true, notFound: true },
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<MessageDto>> {
    // TODO: グループは自由に作れるので、大量のグループメンバーがいるグループを削除する攻撃パターンが考えられる。
    // それに、グループを削除したときの投稿の扱いも考慮する必要がある。
    // 現状は放置するが、将来的に対策を考えること。
    await this.deleteGroupUseCase.execute(id);
    return { success: true, data: { message: 'Group deleted successfully' } };
  }
}
