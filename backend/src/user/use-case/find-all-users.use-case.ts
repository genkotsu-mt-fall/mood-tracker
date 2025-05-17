import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    data: UserEntity[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.userRepo.findAllWithCount({
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
