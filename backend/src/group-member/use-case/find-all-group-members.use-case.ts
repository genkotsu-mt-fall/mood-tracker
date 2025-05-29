import { Injectable } from '@nestjs/common';
import { GroupMemberEntity } from '../entity/group-member.entity';
import { GroupMemberRepository } from '../repository/group-member.repository';

@Injectable()
export class FindAllGroupMembersUseCase {
  constructor(private readonly groupMemberRepo: GroupMemberRepository) {}

  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    data: GroupMemberEntity[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.groupMemberRepo.findAllWithCount({
      skip,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
      hasNextPage: skip + data.length < total,
    };
  }
}
