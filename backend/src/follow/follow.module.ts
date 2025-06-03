import { Module } from '@nestjs/common';
import { FollowController } from './controller/follow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';
import { FindAllFollowsUseCase } from './use-case/find-all-follows.use-case';
import { FindFollowByIdUseCase } from './use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from './use-case/delete-follow.use-case';
import { FollowRepository } from './repository/follow.repository';
import { PrismaFollowRepository } from './repository/prisma-follow.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateFollowUseCase,
    FindAllFollowsUseCase,
    FindFollowByIdUseCase,
    DeleteFollowUseCase,
    {
      provide: FollowRepository,
      useClass: PrismaFollowRepository,
    },
  ],
  controllers: [FollowController],
  exports: [
    CreateFollowUseCase,
    FindAllFollowsUseCase,
    FindFollowByIdUseCase,
    DeleteFollowUseCase,
  ],
})
export class FollowModule {}
