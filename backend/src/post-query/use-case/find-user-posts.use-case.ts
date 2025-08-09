import { Injectable } from '@nestjs/common';
import { PostEntity } from 'src/post/entity/post.entity';
import { PostQueryRepository } from '../repository/post-query.repository';
import { VisiblePostsQueryRunner } from './shared/visible-posts-query-runner';

@Injectable()
export class FindUserPostsUseCase {
  constructor(
    private readonly postQueryRepository: PostQueryRepository,
    private readonly runner: VisiblePostsQueryRunner,
  ) {}

  async execute(
    viewerId: string,
    targetUserId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<{
    data: PostEntity[];
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const fetchBatch = async (skip: number, take: number) => {
      const { data } = await this.postQueryRepository.findUserPosts(
        targetUserId,
        {
          skip,
          take,
        },
      );
      return data;
    };

    return await this.runner.run(viewerId, { page, limit }, fetchBatch);
  }
}
