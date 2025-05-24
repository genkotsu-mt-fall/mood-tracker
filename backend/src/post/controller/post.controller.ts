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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
import { CreatePostUseCase } from '../use-case/create-post.use-case';
import { FindAllPostsUseCase } from '../use-case/find-all-posts.use-case';
import { FindPostByIdUseCase } from '../use-case/find-post-by-id.use-case';
import { UpdatePostUseCase } from '../use-case/update-post.use-case';
import { DeletePostUseCase } from '../use-case/delete-post.use-case';
import { PostResponseDto } from '../dto/post_response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { PostOwnerGuard } from '../guard/post-owner.guard';

@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly findAllPostUseCase: FindAllPostsUseCase,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const result = await this.createPostUseCase.execute(user.id, dto);
    return new PostResponseDto(result);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit } = query;
    const result = await this.findAllPostUseCase.execute({ page, limit });

    return new PaginatedResponseDto<PostResponseDto>({
      data: result.data.map((item) => new PostResponseDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PostResponseDto> {
    const result = await this.findPostByIdUseCase.execute(id);
    return new PostResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Put(':id')
  async update(
    // @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const result = await this.updatePostUseCase.execute(id, dto);
    return new PostResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Delete(':id')
  async remove(
    // @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deletePostUseCase.execute(id);
    return { message: 'Post deleted successfully' };
  }
}
