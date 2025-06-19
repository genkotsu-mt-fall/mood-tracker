import { Module } from '@nestjs/common';
import { FollowController } from './controller/follow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';
// import { FindAllFollowsUseCase } from './use-case/find-all-follows.use-case';
import { FindFollowByIdUseCase } from './use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from './use-case/delete-follow.use-case';
import { FollowRepository } from './repository/follow.repository';
import { PrismaFollowRepository } from './repository/prisma-follow.repository';
import { FindFollowRelationUseCase } from './use-case/find-follow-relation.usecase';
import { FollowOwnerGuard } from './guard/follow-owner.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  providers: [
    FollowOwnerGuard,
    CreateFollowUseCase,
    // FindAllFollowsUseCase,
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
    CreateFollowUseCase,
    // FindAllFollowsUseCase,
    FindFollowByIdUseCase,
    DeleteFollowUseCase,
    FindFollowRelationUseCase,
  ],
})
export class FollowModule {}
