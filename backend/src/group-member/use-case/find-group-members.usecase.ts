import { Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { FindGroupByIdUseCase } from 'src/group/use-case/find-group-by-id.use-case';

@Injectable()
export class FindGroupMembersUseCase {
  constructor(
    private readonly findGroupByIdUseCase: FindGroupByIdUseCase,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(groupId: string): Promise<UserResponseDto[]> {
    await this.findGroupByIdUseCase.execute(groupId);

    const members =
      await this.groupMemberRepository.findMembersByGroupId(groupId);

    return members.map((member) => new UserResponseDto(member));
  }
}
