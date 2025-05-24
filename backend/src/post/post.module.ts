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

@Module({
  imports: [PrismaModule],
  providers: [
    CreatePostUseCase,
    FindAllPostsUseCase,
    FindPostByIdUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
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
  ],
})
export class PostModule {}
