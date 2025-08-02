import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreatePostUseCase } from './use-case/create-post.use-case';
import { FindAllPostsUseCase } from './use-case/find-all-posts.use-case';
import { FindPostByIdUseCase } from './use-case/find-post-by-id.use-case';
import { UpdatePostUseCase } from './use-case/update-post.use-case';
import { DeletePostUseCase } from './use-case/delete-post.use-case';
import { PostRepository } from './repository/post.repository';
import { PrismaPostRepository } from './repository/prisma-post.repository';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';
// import { AuthModule } from 'src/auth/auth.module';
import { PostOwnerGuard } from './guard/post-owner.guard';
import { FollowModule } from 'src/follow/follow.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';

@Module({
  imports: [PrismaModule, /*AuthModule*/ FollowModule, GroupMemberModule],
  providers: [
    PostOwnerGuard,
    CreatePostUseCase,
    FindAllPostsUseCase,
    FindPostByIdUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    EvaluateVisibilityForPost,
    {
      provide: PostRepository,
      useClass: PrismaPostRepository,
    },
  ],
  controllers: [PostController],
  exports: [
    CreatePostUseCase,
    FindAllPostsUseCase,
    FindPostByIdUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    EvaluateVisibilityForPost,
  ],
})
export class PostModule {}
