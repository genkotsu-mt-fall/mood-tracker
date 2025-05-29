import { Injectable } from '@nestjs/common';
import { GroupMemberRepository } from '../repository/group-member.repository';
import { GroupMemberWithGroupOwnerEntity } from '../entity/group-member-with-group-owner.entity';

@Injectable()
export class LoadGroupMemberWithGroupOwnerUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  /**
   * GroupMember とその所属グループの owner 情報を取得します。
   *
   * - 対象が存在しない場合は Repository 側で NotFoundException をスローします。
   * - Guard や認可処理での使用を想定しています。
   *
   * @param id GroupMember の ID
   * @returns GroupMemberWithGroupOwner
   */
  async execute(id: string): Promise<GroupMemberWithGroupOwnerEntity> {
    return await this.groupMemberRepo.loadWithGroupOwnerById(id);
  }
}
