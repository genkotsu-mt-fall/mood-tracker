import { Module } from '@nestjs/common';
import { UserGroupController } from './user-group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupModule } from 'src/group/group.module';
import { PrismaUserGroupRepository } from './repository/prisma-user-group.repository';
import { FindOwnedGroupsUseCase } from './use-case/find-owned-groups.usecase';
import { UserGroupRepository } from './repository/user-group.repository';

@Module({
  imports: [PrismaModule, GroupModule],
  providers: [
    FindOwnedGroupsUseCase,
    {
      provide: UserGroupRepository,
      useClass: PrismaUserGroupRepository,
    },
  ],
  exports: [FindOwnedGroupsUseCase],
  controllers: [UserGroupController],
})
export class UserGroupModule {}
