import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import { CreateGroupMemberUseCase } from '../use-case/create-group-member.use-case';
import { FindGroupMemberByIdUseCase } from '../use-case/find-group-member-by-id.use-case';
import { DeleteGroupMemberUseCase } from '../use-case/delete-group-member.use-case';
import { GroupMemberResponseDto } from '../dto/group-member_response.dto';
import { GroupMemberOwnerGuard } from '../guard/group-member-owner.guard';
import { ApiResponse } from 'src/common/response/api-response';
import { MessageDto } from 'src/common/dto/message.dto';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';
import { DeleteGroupMemberByPairUseCase } from '../use-case/delete-group-member-by-pair.use-case';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('group-member')
export class GroupMemberController {
  constructor(
    private readonly createGroupMemberUseCase: CreateGroupMemberUseCase,
    private readonly findGroupMemberByIdUseCase: FindGroupMemberByIdUseCase,
    private readonly deleteGroupMemberUseCase: DeleteGroupMemberUseCase,
    private readonly deleteGroupMemberByPairUseCase: DeleteGroupMemberByPairUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiEndpoint({
    summary: 'Create a new group member',
    description: 'This endpoint allows you to create a new member in a group.',
    body: CreateGroupMemberDto,
    response: {
      type: GroupMemberResponseDto,
      kind: ResponseKind.Created,
      description: 'GroupMember successfully created',
    },
    auth: true,
    errors: {
      unauthorized: true,
      badRequest: true,
      forbidden: true,
      notFound: true,
    },
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGroupMemberDto,
  ): Promise<ApiResponse<GroupMemberResponseDto>> {
    const result = await this.createGroupMemberUseCase.execute(
      req.user.id,
      dto,
    );
    return { success: true, data: new GroupMemberResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, GroupMemberOwnerGuard)
  @Get(':id')
  @ApiEndpoint({
    summary: 'Find a group member by ID',
    description: 'This endpoint retrieves a group member by their unique ID.',
    response: {
      type: GroupMemberResponseDto,
      description: 'GroupMember retrieved successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group member' },
    errors: {
      unauthorized: true,
      forbidden: true,
      notFound: true,
    },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<GroupMemberResponseDto>> {
    const result = await this.findGroupMemberByIdUseCase.execute(id);
    return { success: true, data: new GroupMemberResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, GroupMemberOwnerGuard)
  @Delete(':id')
  @ApiEndpoint({
    summary: 'Delete a group member',
    description:
      'This endpoint allows you to delete a group member by their unique ID.',
    response: {
      type: MessageDto,
      description: 'GroupMember deleted successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group member' },
    errors: {
      unauthorized: true,
      forbidden: true,
      notFound: true,
    },
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<MessageDto>> {
    await this.deleteGroupMemberUseCase.execute(id);
    return {
      success: true,
      data: { message: 'GroupMember deleted successfully' },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('group/:groupId/member/:memberId')
  @ApiEndpoint({
    summary: 'Delete a group member by (groupId, memberId)',
    description:
      'This endpoint deletes a group member specified by groupId and memberId.',
    response: {
      type: MessageDto,
      description: 'GroupMember deleted successfully',
    },
    auth: true,
    errors: {
      unauthorized: true,
      forbidden: true, // group owner でない等
      notFound: true, // group or membership が存在しない等
    },
  })
  async removeByPair(
    @CurrentUser() user: UserEntity,
    @Param('groupId', new ParseUUIDPipe({ version: '4' })) groupId: string,
    @Param('memberId', new ParseUUIDPipe({ version: '4' })) memberId: string,
  ): Promise<ApiResponse<MessageDto>> {
    await this.deleteGroupMemberByPairUseCase.execute(
      user.id,
      groupId,
      memberId,
    );
    return {
      success: true,
      data: { message: 'GroupMember deleted successfully' },
    };
  }
}
