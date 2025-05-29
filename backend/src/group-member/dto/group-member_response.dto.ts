import { GroupMemberEntity } from '../entity/group-member.entity';

export class GroupMemberResponseDto {
  constructor(entity: GroupMemberEntity) {
    this.id = entity.id;
    this.groupId = entity.groupId;
    this.memberId = entity.memberId;
    this.addedAt = entity.addedAt;
  }

  id: string;
  groupId: string;
  memberId: string;
  addedAt: Date;
}
