import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { FindGroupByIdUseCase } from 'src/group/use-case/find-group-by-id.use-case';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeleteGroupMemberByPairUseCase {
  constructor(
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly findGroupByIdUseCase: FindGroupByIdUseCase,
  ) {}

  async execute(
    userId: string,
    groupId: string,
    memberId: string,
  ): Promise<void> {
    const group = await this.findGroupByIdUseCase.execute(groupId);
    if (!group) {
      throw new NotFoundException(ErrorMessage.GroupNotFound(groupId));
    }

    if (group.userId !== userId) {
      throw new ForbiddenException(
        'このグループのメンバーを削除する権限がありません。',
      );
    }

    const item = await this.groupMemberRepository.findByPair(groupId, memberId);
    if (!item) {
      throw new NotFoundException(
        ErrorMessage.GroupMemberNotFoundByPair(groupId, memberId),
      );
    }

    await this.groupMemberRepository.delete(item.id);
  }
}
