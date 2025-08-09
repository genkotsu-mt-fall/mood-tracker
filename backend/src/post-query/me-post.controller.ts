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
import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  executePaginatedPostQueryViewerFlexible,
  ViewerFlexibleUseCase,
} from './helper/execute-paginated-post-query';

@Controller('auth/me')
export class MePostController {
  constructor(
    private readonly findUserPostsUseCase: FindUserPostsUseCase,
    private readonly findFollowingUsersPostsUseCase: FindFollowingUsersPostsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOwnPosts(
    @CurrentUser() user: UserEntity,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const boundedUseCase: ViewerFlexibleUseCase = (
      viewerId: string,
      userId: string,
      query: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<PostResponseDto>> =>
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFollowingPosts(
    @CurrentUser() user: UserEntity,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const boundedUseCase: ViewerFlexibleUseCase = (
      viewerId: string,
      userId: string,
      query: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<PostResponseDto>> =>
      this.findFollowingUsersPostsUseCase.execute(viewerId, userId, query);
    return await executePaginatedPostQueryViewerFlexible(
      user.id,
      user.id,
      query,
      boundedUseCase,
    );
  }

  // GET /user/:id/posts
  // 特定のユーザーの投稿一覧を取得
}
