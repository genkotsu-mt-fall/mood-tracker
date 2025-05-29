import {
  GroupMember as PrismaGroupMember,
  Group as PrismaGroup,
} from '@prisma/client';
import { GroupMemberEntity } from '../entity/group-member.entity';
import { GroupMemberWithGroupOwnerEntity } from '../entity/group-member-with-group-owner.entity';

export function toGroupMemberEntity(
  data: PrismaGroupMember,
): GroupMemberEntity {
  return new GroupMemberEntity(
    data.id,
    data.group_id,
    data.member_id,
    data.added_at,
  );
}

export function toGroupMemberWithGroupOwner(
  data: PrismaGroupMember & {
    group: Pick<PrismaGroup, 'user_id'>;
  },
): GroupMemberWithGroupOwnerEntity {
  return new GroupMemberWithGroupOwnerEntity(
    data.id,
    data.group_id,
    data.member_id,
    data.added_at,
    data.group.user_id,
  );
}
