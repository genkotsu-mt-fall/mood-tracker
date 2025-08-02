import { Injectable } from '@nestjs/common';
import { GroupEntity } from 'src/group/entity/group.entity';
import { UserGroupRepository } from '../repository/user-group.repository';

@Injectable()
export class FindOwnedGroupsUseCase {
  constructor(private readonly userGroupRepository: UserGroupRepository) {}

  async execute(userId: string): Promise<GroupEntity[]> {
    return await this.userGroupRepository.findOwnedGroups(userId);
  }
}
