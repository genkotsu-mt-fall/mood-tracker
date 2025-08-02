import { Module } from '@nestjs/common';
import { FollowController } from './controller/follow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FindFollowByIdUseCase } from './use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from './use-case/delete-follow.use-case';
import { FollowRepository } from './repository/follow.repository';
import { PrismaFollowRepository } from './repository/prisma-follow.repository';
import { FindFollowRelationUseCase } from './use-case/find-follow-relation.usecase';
import { FollowOwnerGuard } from './guard/follow-owner.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    FollowOwnerGuard,
    FindFollowByIdUseCase,
    DeleteFollowUseCase,
    FindFollowRelationUseCase,
    {
      provide: FollowRepository,
      useClass: PrismaFollowRepository,
    },
  ],
  controllers: [FollowController],
  exports: [
    FindFollowByIdUseCase,
    DeleteFollowUseCase,
    FindFollowRelationUseCase,
  ],
})
export class FollowModule {}
