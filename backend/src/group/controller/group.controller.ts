import {
  Controller,
  Get,
  Post,
  Put,
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
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { CreateGroupUseCase } from '../use-case/create-group.use-case';
import { FindAllGroupsUseCase } from '../use-case/find-all-groups.use-case';
import { FindGroupByIdUseCase } from '../use-case/find-group-by-id.use-case';
import { UpdateGroupUseCase } from '../use-case/update-group.use-case';
import { DeleteGroupUseCase } from '../use-case/delete-group.use-case';
import { GroupResponseDto } from '../dto/group_response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { GroupOwnerGuard } from '../guard/group-owner.guard';

@Controller('group')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly findAllGroupUseCase: FindAllGroupsUseCase,
    private readonly findGroupByIdUseCase: FindGroupByIdUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGroupDto,
  ): Promise<GroupResponseDto> {
    const result = await this.createGroupUseCase.execute(req.user.id, dto);
    return new GroupResponseDto(result);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<GroupResponseDto>> {
    const { page, limit } = query;
    const result = await this.findAllGroupUseCase.execute({ page, limit });

    return new PaginatedResponseDto<GroupResponseDto>({
      data: result.data.map((item) => new GroupResponseDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupResponseDto> {
    const result = await this.findGroupByIdUseCase.execute(id);
    return new GroupResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, GroupOwnerGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<GroupResponseDto> {
    const result = await this.updateGroupUseCase.execute(id, dto);
    return new GroupResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, GroupOwnerGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deleteGroupUseCase.execute(id);
    return { message: 'Group deleted successfully' };
  }
}
