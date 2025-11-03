import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindAllPostsUseCase } from './use-case/find-all-posts.use-case';
import { FindPostByIdUseCase } from './use-case/find-post-by-id.use-case';
import {
  executePaginatedPostQueryViewerFixed,
  ViewerFixedUseCase,
} from './helper/execute-paginated-post-query';
import {
  ApiResponse,
  PaginatedApiResponse,
} from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';

@Controller('post')
export class PostQueryController {
  constructor(
    private readonly findAllPostUseCase: FindAllPostsUseCase,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiEndpoint({
    summary: 'Get all visible posts',
    description:
      'Retrieve a paginated list of posts that are visible to the authenticated user.',
    response: {
      type: PostResponseDto,
      kind: ResponseKind.Paginated,
      description: 'Posts retrieved successfully',
    },
    auth: true,
    errors: { unauthorized: true },
    extraModels: [PaginationQueryDto],
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @CurrentUser() user: UserEntity,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedApiResponse<PostResponseDto>> {
    // const { page, limit } = query;
    // const result = await this.findAllPostUseCase.execute(user.id, {
    //   page,
    //   limit,
    // });

    // return new PaginatedResponseDto<PostResponseDto>({
    //   data: result.data.map((item) => new PostResponseDto(item)),
    //   // total: result.total,
    //   page: result.page,
    //   limit: result.limit,
    //   hasNextPage: result.hasNextPage,
    // });
    const boundedUseCase: ViewerFixedUseCase = (
      userId: string,
      query: PaginationQueryDto,
    ): Promise<PaginatedApiResponse<PostResponseDto>> =>
      this.findAllPostUseCase.execute(userId, query);
    return await executePaginatedPostQueryViewerFixed(
      user.id,
      query,
      boundedUseCase,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiEndpoint({
    summary: 'Get a post by ID',
    description:
      'Fetch a single post by ID if it is visible to the authenticated user.',
    response: {
      type: PostResponseDto,
      description: 'Post retrieved successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Post' },
    errors: { unauthorized: true, notFound: true },
  })
  async findOne(
    @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<PostResponseDto>> {
    const result = await this.findPostByIdUseCase.execute(user.id, id);
    return { success: true, data: new PostResponseDto(result) };
  }
}
