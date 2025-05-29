import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class FindGroupMemberByIdUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  async execute(id: string) {
    const item = await this.groupMemberRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.GroupMemberNotFound(id));
    }
    return item;
  }
}
