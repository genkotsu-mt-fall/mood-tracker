import { Module } from '@nestjs/common';
import { GroupMemberController } from './controller/group-member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGroupMemberUseCase } from './use-case/create-group-member.use-case';
import { FindAllGroupMembersUseCase } from './use-case/find-all-group-members.use-case';
import { FindGroupMemberByIdUseCase } from './use-case/find-group-member-by-id.use-case';
import { DeleteGroupMemberUseCase } from './use-case/delete-group-member.use-case';
import { GroupMemberRepository } from './repository/group-member.repository';
import { PrismaGroupMemberRepository } from './repository/prisma-group-member.repository';
// import { AuthModule } from 'src/auth/auth.module';
import { GroupMemberOwnerGuard } from './guard/group-member-owner.guard';
import { FindGroupIdsByMemberIdUseCase } from './use-case/find-group-ids-by-member-id.usecase';
import { LoadGroupMemberWithGroupOwnerUseCase } from './use-case/load-group-member-with-group-owner.use-case';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { GroupController } from './controller/group.controller';
import { FindGroupMembersUseCase } from './use-case/find-group-members.usecase';

@Module({
  imports: [PrismaModule, UserModule, GroupModule],
  providers: [
    GroupMemberOwnerGuard,
    CreateGroupMemberUseCase,
    FindAllGroupMembersUseCase,
    FindGroupMemberByIdUseCase,
    FindGroupIdsByMemberIdUseCase,
    DeleteGroupMemberUseCase,
    LoadGroupMemberWithGroupOwnerUseCase,
    FindGroupMembersUseCase,
    {
      provide: GroupMemberRepository,
      useClass: PrismaGroupMemberRepository,
    },
  ],
  controllers: [GroupMemberController, GroupController],
  exports: [
    CreateGroupMemberUseCase,
    FindAllGroupMembersUseCase,
    FindGroupMemberByIdUseCase,
    FindGroupIdsByMemberIdUseCase,
    DeleteGroupMemberUseCase,
    LoadGroupMemberWithGroupOwnerUseCase,
    FindGroupMembersUseCase,
  ],
})
export class GroupMemberModule {}
