import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { GroupEntity } from '../entity/group.entity';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class UpdateGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(id: string, dto: UpdateGroupDto): Promise<GroupEntity> {
    const item = await this.groupRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.GroupNotFound(id));
    }
    return await this.groupRepo.update(id, {
      ...dto,
    });
  }
}
