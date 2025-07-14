import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import { GroupMemberEntity } from '../entity/group-member.entity';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { FindUserByIdUseCase } from 'src/user/use-case/find-user-by-id.use-case';
import { FindGroupByIdUseCase } from 'src/group/use-case/find-group-by-id.use-case';

@Injectable()
export class CreateGroupMemberUseCase {
  constructor(
    private readonly groupMemberRepo: GroupMemberRepository,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findGroupByIdUseCase: FindGroupByIdUseCase,
  ) {}

  async execute(
    userId: string,
    dto: CreateGroupMemberDto,
  ): Promise<GroupMemberEntity> {
    if (userId === dto.memberId) {
      throw new BadRequestException('Cannot add yourself as a group member');
    }

    // memberId のユーザーが存在するか確認
    await this.findUserByIdUseCase.execute(dto.memberId);

    // groupId のグループが存在するか確認
    const group = await this.findGroupByIdUseCase.execute(dto.groupId);

    // グループオーナーでなければ拒否
    if (group.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    return await this.groupMemberRepo.create(userId, dto);
  }
}
