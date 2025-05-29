import { Injectable } from '@nestjs/common';
import { GroupEntity } from '../entity/group.entity';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class FindAllGroupsUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    data: GroupEntity[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.groupRepo.findAllWithCount({
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
