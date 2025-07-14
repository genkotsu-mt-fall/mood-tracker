import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create_group.dto';
import { GroupEntity } from '../entity/group.entity';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class CreateGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(userId: string, dto: CreateGroupDto): Promise<GroupEntity> {
    return await this.groupRepo.create(userId, dto);
  }
}
