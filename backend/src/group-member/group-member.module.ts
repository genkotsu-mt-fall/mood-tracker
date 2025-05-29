import { Module } from '@nestjs/common';
import { GroupMemberController } from './controller/group-member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGroupMemberUseCase } from './use-case/create-group-member.use-case';
import { FindAllGroupMembersUseCase } from './use-case/find-all-group-members.use-case';
import { FindGroupMemberByIdUseCase } from './use-case/find-group-member-by-id.use-case';
import { UpdateGroupMemberUseCase } from './use-case/update-group-member.use-case';
import { DeleteGroupMemberUseCase } from './use-case/delete-group-member.use-case';
import { GroupMemberRepository } from './repository/group-member.repository';
import { PrismaGroupMemberRepository } from './repository/prisma-group-member.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateGroupMemberUseCase,
    FindAllGroupMembersUseCase,
    FindGroupMemberByIdUseCase,
    UpdateGroupMemberUseCase,
    DeleteGroupMemberUseCase,
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
    UpdateGroupMemberUseCase,
    DeleteGroupMemberUseCase,
  ],
})
export class GroupMemberModule {}
