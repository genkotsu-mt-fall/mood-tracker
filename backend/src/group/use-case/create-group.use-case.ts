import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create_group.dto';
import { GroupEntity } from '../entity/group.entity';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class CreateGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(
    // 必要に応じてユーザーIDなど追加
    userId: string,
    dto: CreateGroupDto,
  ): Promise<GroupEntity> {
    // 必要に応じて事前バリデーションや加工
    return await this.groupRepo.create(userId, dto);
  }
}
