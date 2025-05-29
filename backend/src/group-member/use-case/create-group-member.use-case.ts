import { Injectable } from '@nestjs/common';
import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import { GroupMemberEntity } from '../entity/group-member.entity';
import { GroupMemberRepository } from '../repository/group-member.repository';

@Injectable()
export class CreateGroupMemberUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  async execute(
    // 必要に応じてユーザーIDなど追加
    userId: string,
    dto: CreateGroupMemberDto,
  ): Promise<GroupMemberEntity> {
    // 必要に応じて事前バリデーションや加工
    return await this.groupMemberRepo.create(userId, dto);
  }
}
