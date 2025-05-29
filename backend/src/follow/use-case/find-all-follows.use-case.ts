import { Injectable } from '@nestjs/common';
import { FollowEntity } from '../entity/follow.entity';
import { FollowRepository } from '../repository/follow.repository';

@Injectable()
export class FindAllFollowsUseCase {
  constructor(private readonly followRepo: FollowRepository) {}

  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    data: FollowEntity[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.followRepo.findAllWithCount({
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
