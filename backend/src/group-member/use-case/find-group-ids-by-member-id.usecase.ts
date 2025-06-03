import { Injectable } from '@nestjs/common';
import { GroupMembershipCollection } from '../entity/group-membership.collection';
import { GroupMemberRepository } from '../repository/group-member.repository';

@Injectable()
export class FindGroupIdsByMemberIdUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  async execute(userId: string): Promise<GroupMembershipCollection | null> {
    return await this.groupMemberRepo.findGroupIdsByMemberId(userId);
  }
}
