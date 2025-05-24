import { Injectable } from '@nestjs/common';
import { PostEntity } from '../entity/post.entity';
import { PostRepository } from '../repository/post.repository';

@Injectable()
export class FindAllPostsUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute({ page, limit }: { page: number; limit: number }): Promise<{
    data: PostEntity[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.postRepo.findAllWithCount({
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
