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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindUserPostsUseCase } from './use-case/find-user-posts.use-case';
import {
  executePaginatedPostQueryViewerFlexible,
  ViewerFlexibleUseCase,
} from './helper/execute-paginated-post-query';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FindUserByIdUseCase } from 'src/user/use-case/find-user-by-id.use-case';

@Controller('user')
export class UserPostController {
  constructor(
    private readonly findUserPostsUseCase: FindUserPostsUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/posts')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserPosts(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    await this.findUserByIdUseCase.execute(userId);

    const boundedUseCase: ViewerFlexibleUseCase = (
      viewerId: string,
      userId: string,
      query: PaginationQueryDto,
    ) => this.findUserPostsUseCase.execute(viewerId, userId, query);

    return await executePaginatedPostQueryViewerFlexible(
      currentUser.id,
      userId,
      query,
      boundedUseCase,
    );
  }
}
