import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import { CreateGroupMemberUseCase } from '../use-case/create-group-member.use-case';
import { FindAllGroupMembersUseCase } from '../use-case/find-all-group-members.use-case';
import { FindGroupMemberByIdUseCase } from '../use-case/find-group-member-by-id.use-case';
import { DeleteGroupMemberUseCase } from '../use-case/delete-group-member.use-case';
import { GroupMemberResponseDto } from '../dto/group-member_response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { GroupMemberOwnerGuard } from '../guard/group-member-owner.guard';

@Controller('group-member')
export class GroupMemberController {
  constructor(
    private readonly createGroupMemberUseCase: CreateGroupMemberUseCase,
    private readonly findAllGroupMemberUseCase: FindAllGroupMembersUseCase,
    private readonly findGroupMemberByIdUseCase: FindGroupMemberByIdUseCase,
    private readonly deleteGroupMemberUseCase: DeleteGroupMemberUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGroupMemberDto,
  ): Promise<GroupMemberResponseDto> {
    const result = await this.createGroupMemberUseCase.execute(
      req.user.id,
      dto,
    );
    return new GroupMemberResponseDto(result);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<GroupMemberResponseDto>> {
    const { page, limit } = query;
    const result = await this.findAllGroupMemberUseCase.execute({
      page,
      limit,
    });

    return new PaginatedResponseDto<GroupMemberResponseDto>({
      data: result.data.map((item) => new GroupMemberResponseDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupMemberResponseDto> {
    const result = await this.findGroupMemberByIdUseCase.execute(id);
    return new GroupMemberResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, GroupMemberOwnerGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deleteGroupMemberUseCase.execute(id);
    return { message: 'GroupMember deleted successfully' };
  }
}
