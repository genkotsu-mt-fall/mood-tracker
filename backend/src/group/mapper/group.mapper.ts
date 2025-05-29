import { Group as PrismaGroup } from '@prisma/client';
import { GroupEntity } from '../entity/group.entity';

export function toGroupEntity(data: PrismaGroup): GroupEntity {
  return new GroupEntity(data.id, data.name, data.created_at, data.user_id);
}
