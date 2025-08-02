import { GroupEntity } from 'src/group/entity/group.entity';

export abstract class UserGroupRepository {
  abstract findOwnedGroups(userId: string): Promise<GroupEntity[]>;
}
