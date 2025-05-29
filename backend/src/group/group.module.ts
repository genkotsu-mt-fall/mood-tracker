import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGroupUseCase } from './use-case/create-group.use-case';
import { FindAllGroupsUseCase } from './use-case/find-all-groups.use-case';
import { FindGroupByIdUseCase } from './use-case/find-group-by-id.use-case';
import { UpdateGroupUseCase } from './use-case/update-group.use-case';
import { DeleteGroupUseCase } from './use-case/delete-group.use-case';
import { GroupRepository } from './repository/group.repository';
import { PrismaGroupRepository } from './repository/prisma-group.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateGroupUseCase,
    FindAllGroupsUseCase,
    FindGroupByIdUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    {
      provide: GroupRepository,
      useClass: PrismaGroupRepository,
    },
  ],
  controllers: [GroupController],
  exports: [
    CreateGroupUseCase,
    FindAllGroupsUseCase,
    FindGroupByIdUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
  ],
})
export class GroupModule {}
