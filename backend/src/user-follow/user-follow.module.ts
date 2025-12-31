import { Module } from '@nestjs/common';
import { UserFollowController } from './user-follow.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { FollowModule } from 'src/follow/follow.module';
import { MeFollowController } from './me-follow.controller';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';
import { FollowRepository } from 'src/follow/repository/follow.repository';
import { PrismaFollowRepository } from 'src/follow/repository/prisma-follow.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FollowController } from './follow.controller';
import { FindFollowersByUserIdUseCase } from './use-case/find-followers-by-user-id.use-case';
import { FindFollowingByUserIdUseCase } from './use-case/find-following-by-user-id.use-case';
import { DeleteFollowByFolloweeUseCase } from './use-case/delete-follow-by-followee.use-case';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, FollowModule],
  providers: [
    CreateFollowUseCase,
    FindFollowersByUserIdUseCase,
    FindFollowingByUserIdUseCase,
    DeleteFollowByFolloweeUseCase,
    {
      provide: FollowRepository,
      useClass: PrismaFollowRepository,
    },
  ],
  controllers: [UserFollowController, MeFollowController, FollowController],
  exports: [
    CreateFollowUseCase,
    FindFollowersByUserIdUseCase,
    FindFollowingByUserIdUseCase,
    DeleteFollowByFolloweeUseCase,
  ],
})
export class UserFollowModule {}
