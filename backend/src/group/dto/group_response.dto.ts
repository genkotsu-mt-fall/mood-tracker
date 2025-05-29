import { GroupEntity } from '../entity/group.entity';

export class GroupResponseDto {
  constructor(entity: GroupEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}
