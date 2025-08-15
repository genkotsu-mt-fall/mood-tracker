import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindFollowingUsersPostsUseCase } from './use-case/find-following-users-posts.use-case';
import { FindUserPostsUseCase } from './use-case/find-user-posts.use-case';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  executePaginatedPostQueryViewerFlexible,
  ViewerFlexibleUseCase,
} from './helper/execute-paginated-post-query';
import { PaginatedApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';

@Controller('auth/me')
export class MePostController {
  constructor(
    private readonly findUserPostsUseCase: FindUserPostsUseCase,
    private readonly findFollowingUsersPostsUseCase: FindFollowingUsersPostsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  @ApiEndpoint({
    summary: 'Get own posts',
    description:
      'Retrieve a paginated list of posts created by the authenticated user.',
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
  async getOwnPosts(
    @CurrentUser() user: UserEntity,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedApiResponse<PostResponseDto>> {
    const boundedUseCase: ViewerFlexibleUseCase = (
      viewerId: string,
      userId: string,
      query: PaginationQueryDto,
    ): Promise<PaginatedApiResponse<PostResponseDto>> =>
      this.findUserPostsUseCase.execute(viewerId, userId, query);
    // const boundedUseCase = this.findUserPostsUseCase.execute.bind(
    //   this.findUserPostsUseCase,
    // ) as (
    //   userId: string,
    //   query: PaginationQueryDto,
    // ) => Promise<PaginatedResponseDto<PostResponseDto>>;
    return await executePaginatedPostQueryViewerFlexible(
      user.id,
      user.id,
      query,
      boundedUseCase,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('following/posts')
  @ApiEndpoint({
    summary: 'Get posts from followed users',
    description:
      'Retrieve a paginated list of posts from users that the authenticated user is following.',
    response: {
      type: PostResponseDto,
      kind: ResponseKind.Paginated,
      description: "Following users' posts retrieved successfully",
    },
    auth: true,
    errors: { unauthorized: true },
    extraModels: [PaginationQueryDto],
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFollowingPosts(
    @CurrentUser() user: UserEntity,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedApiResponse<PostResponseDto>> {
    const boundedUseCase: ViewerFlexibleUseCase = (
      viewerId: string,
      userId: string,
      query: PaginationQueryDto,
    ): Promise<PaginatedApiResponse<PostResponseDto>> =>
      this.findFollowingUsersPostsUseCase.execute(viewerId, userId, query);
    return await executePaginatedPostQueryViewerFlexible(
      user.id,
      user.id,
      query,
      boundedUseCase,
    );
  }
}
