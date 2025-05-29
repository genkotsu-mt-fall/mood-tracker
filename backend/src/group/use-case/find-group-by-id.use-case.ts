import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class FindGroupByIdUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(id: string) {
    const item = await this.groupRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.GroupNotFound(id));
    }
    return item;
  }
}
