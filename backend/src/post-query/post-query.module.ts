import { Module } from '@nestjs/common';
import { PostQueryController } from './post-query.controller';
import { FollowModule } from 'src/follow/follow.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';
import { FindAllPostsUseCase } from './use-case/find-all-posts.use-case';
import { FindPostByIdUseCase } from './use-case/find-post-by-id.use-case';
import { PostQueryRepository } from './repository/post-query.repository';
import { PrismaPostQueryRepository } from './repository/prisma-post-query.repository';
import { FindUserPostsUseCase } from './use-case/find-user-posts.use-case';
import { FindFollowingUsersPostsUseCase } from './use-case/find-following-users-posts.use-case';
import { MePostController } from './me-post.controller';
import { UserPostController } from './user-post.controller';
import { UserModule } from 'src/user/user.module';
import { VisiblePostsQueryRunner } from './use-case/shared/visible-posts-query-runner';

@Module({
  imports: [PrismaModule, FollowModule, GroupMemberModule, UserModule],
  providers: [
    FindAllPostsUseCase,
    FindPostByIdUseCase,
    EvaluateVisibilityForPost,
    VisiblePostsQueryRunner,
    FindUserPostsUseCase,
    FindFollowingUsersPostsUseCase,
    {
      provide: PostQueryRepository,
      useClass: PrismaPostQueryRepository,
    },
  ],
  exports: [
    FindAllPostsUseCase,
    FindPostByIdUseCase,
    EvaluateVisibilityForPost,
    VisiblePostsQueryRunner,
    FindUserPostsUseCase,
    FindFollowingUsersPostsUseCase,
  ],
  controllers: [PostQueryController, MePostController, UserPostController],
})
export class PostQueryModule {}
