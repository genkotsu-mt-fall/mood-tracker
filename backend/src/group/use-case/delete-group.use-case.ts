import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeleteGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(id: string): Promise<void> {
    const item = await this.groupRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.GroupNotFound(id));
    }
    await this.groupRepo.delete(id);
  }
}
