import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { GroupEntity } from '../entity/group.entity';

export abstract class GroupRepository {
  abstract create(userId: string, dto: CreateGroupDto): Promise<GroupEntity>;

  abstract findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: GroupEntity[]; total: number }>;

  abstract findById(id: string): Promise<GroupEntity | null>;

  abstract update(id: string, data: UpdateGroupDto): Promise<GroupEntity>;

  abstract delete(id: string): Promise<void>;
}
