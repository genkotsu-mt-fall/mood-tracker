import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreatePostUseCase } from './use-case/create-post.use-case';
import { UpdatePostUseCase } from './use-case/update-post.use-case';
import { DeletePostUseCase } from './use-case/delete-post.use-case';
import { PostRepository } from './repository/post.repository';
import { PrismaPostRepository } from './repository/prisma-post.repository';
import { PostQueryModule } from 'src/post-query/post-query.module';

@Module({
  imports: [PrismaModule, PostQueryModule],
  providers: [
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    {
      provide: PostRepository,
      useClass: PrismaPostRepository,
    },
  ],
  controllers: [PostController],
  exports: [CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase],
})
export class PostModule {}
