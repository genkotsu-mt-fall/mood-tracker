import { Module } from '@nestjs/common';
import { GroupMemberController } from './controller/group-member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGroupMemberUseCase } from './use-case/create-group-member.use-case';
import { FindAllGroupMembersUseCase } from './use-case/find-all-group-members.use-case';
import { FindGroupMemberByIdUseCase } from './use-case/find-group-member-by-id.use-case';
import { DeleteGroupMemberUseCase } from './use-case/delete-group-member.use-case';
import { GroupMemberRepository } from './repository/group-member.repository';
import { PrismaGroupMemberRepository } from './repository/prisma-group-member.repository';
import { AuthModule } from 'src/auth/auth.module';
import { GroupMemberOwnerGuard } from './guard/group-member-owner.guard';
import { FindGroupIdsByMemberIdUseCase } from './use-case/find-group-ids-by-member-id.usecase';
import { LoadGroupMemberWithGroupOwnerUseCase } from './use-case/load-group-member-with-group-owner.use-case';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, GroupModule],
  providers: [
    GroupMemberOwnerGuard,
    CreateGroupMemberUseCase,
    FindAllGroupMembersUseCase,
    FindGroupMemberByIdUseCase,
    FindGroupIdsByMemberIdUseCase,
    DeleteGroupMemberUseCase,
    LoadGroupMemberWithGroupOwnerUseCase,
    {
      provide: GroupMemberRepository,
      useClass: PrismaGroupMemberRepository,
    },
  ],
  controllers: [GroupMemberController],
  exports: [
    CreateGroupMemberUseCase,
    FindAllGroupMembersUseCase,
    FindGroupMemberByIdUseCase,
    FindGroupIdsByMemberIdUseCase,
    DeleteGroupMemberUseCase,
    LoadGroupMemberWithGroupOwnerUseCase,
  ],
})
export class GroupMemberModule {}
