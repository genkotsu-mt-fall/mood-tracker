import { Injectable } from '@nestjs/common';
import { PostEntity } from '../entity/post.entity';
import { PostRepository } from '../repository/post.repository';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';

@Injectable()
export class FindAllPostsUseCase {
  private readonly DEFAULT_BATCH_SIZE = 20;

  constructor(
    private readonly postRepo: PostRepository,
    private readonly visibilityEvaluator: EvaluateVisibilityForPost,
  ) {}

  async execute(
    userId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<{
    data: PostEntity[];
    // total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    const visiblePosts: PostEntity[] = [];
    let offset = 0;

    while (visiblePosts.length < limit) {
      const nextBatchSize = this.estimateNextBatchSize(
        limit - visiblePosts.length,
      );

      const batch = await this.fetchNextBatch(offset, nextBatchSize);
      if (!batch.length) break;

      const visible = await this.extractVisiblePostsFromBatch(
        batch,
        userId,
        limit,
      );

      visiblePosts.push(...visible);
      offset += batch.length;
    }

    return {
      data: visiblePosts,
      // total,
      page,
      limit,
      hasNextPage: visiblePosts.length === limit,
    };
  }

  private estimateNextBatchSize(remaining: number): number {
    const minimumBatchSize = this.DEFAULT_BATCH_SIZE;
    return Math.max(remaining * 2, minimumBatchSize);
  }

  private async fetchNextBatch(
    skip: number,
    take: number,
  ): Promise<PostEntity[]> {
    const { data } = await this.postRepo.findAllWithCount({ skip, take });
    return data;
  }

  private async extractVisiblePostsFromBatch(
    batch: PostEntity[],
    viewerId: string,
    limit: number,
  ): Promise<PostEntity[]> {
    const result: PostEntity[] = [];
    for (const post of batch) {
      const canView = await this.visibilityEvaluator.execute(post, viewerId);
      if (canView) {
        result.push(post);
        if (result.length >= limit) break;
      }
    }
    return result;
  }
}
