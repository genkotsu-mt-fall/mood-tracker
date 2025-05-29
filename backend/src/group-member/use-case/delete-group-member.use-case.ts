import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeleteGroupMemberUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  async execute(id: string): Promise<void> {
    const item = await this.groupMemberRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.GroupMemberNotFound(id));
    }
    await this.groupMemberRepo.delete(id);
  }
}
