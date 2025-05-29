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
import { CreateFollowDto } from '../dto/create_follow.dto';
import { CreateFollowUseCase } from '../use-case/create-follow.use-case';
import { FindAllFollowsUseCase } from '../use-case/find-all-follows.use-case';
import { FindFollowByIdUseCase } from '../use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from '../use-case/delete-follow.use-case';
import { FollowResponseDto } from '../dto/follow_response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { FollowOwnerGuard } from '../guard/follow-owner.guard';

@Controller('follow')
export class FollowController {
  constructor(
    private readonly createFollowUseCase: CreateFollowUseCase,
    private readonly findAllFollowUseCase: FindAllFollowsUseCase,
    private readonly findFollowByIdUseCase: FindFollowByIdUseCase,
    private readonly deleteFollowUseCase: DeleteFollowUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateFollowDto,
  ): Promise<FollowResponseDto> {
    const result = await this.createFollowUseCase.execute(req.user.id, dto);
    return new FollowResponseDto(result);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FollowResponseDto>> {
    const { page, limit } = query;
    const result = await this.findAllFollowUseCase.execute({ page, limit });

    return new PaginatedResponseDto<FollowResponseDto>({
      data: result.data.map((item) => new FollowResponseDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<FollowResponseDto> {
    const result = await this.findFollowByIdUseCase.execute(id);
    return new FollowResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, FollowOwnerGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deleteFollowUseCase.execute(id);
    return { message: 'Follow deleted successfully' };
  }
}
