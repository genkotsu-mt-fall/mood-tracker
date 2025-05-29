import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import { GroupMemberWithGroupOwnerEntity } from '../entity/group-member-with-group-owner.entity';
import { GroupMemberEntity } from '../entity/group-member.entity';

export abstract class GroupMemberRepository {
  abstract create(
    userId: string,
    dto: CreateGroupMemberDto,
  ): Promise<GroupMemberEntity>;

  abstract findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: GroupMemberEntity[]; total: number }>;

  abstract findById(id: string): Promise<GroupMemberEntity | null>;

  abstract loadWithGroupOwnerById(
    id: string,
  ): Promise<GroupMemberWithGroupOwnerEntity>;

  abstract delete(id: string): Promise<void>;
}
