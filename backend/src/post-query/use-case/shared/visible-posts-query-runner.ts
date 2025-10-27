import { Injectable } from '@nestjs/common';
import { PaginatedApiResponse } from 'src/common/response/api-response';
import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { PostEntity } from 'src/post/entity/post.entity';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';

type FetchBatch = (skip: number, take: number) => Promise<PostEntity[]>;

@Injectable()
export class VisiblePostsQueryRunner {
  private readonly DEFAULT_BATCH_SIZE = 20;
  private readonly MAX_LOOP = 100;

  constructor(
    private readonly visibilityEvaluator: EvaluateVisibilityForPost,
  ) {}

  async run(
    viewerId: string,
    { page, limit }: { page: number; limit: number },
    fetchBatch: FetchBatch,
  ): Promise<PaginatedApiResponse<PostResponseDto>> {
    const visiblePosts: PostEntity[] = [];
    let offset = 0;

    let loopCount = 0;
    const MAX_LOOP = 100;

    while (visiblePosts.length < limit) {
      if (++loopCount > MAX_LOOP) break;

      const nextBatchSize = this.estimateNextBatchSize(
        limit - visiblePosts.length,
      );

      const batch = await fetchBatch(offset, nextBatchSize);
      if (!batch.length) break;

      const visible = await this.extractVisiblePostsFromBatch(
        batch,
        viewerId,
        limit,
      );

      visiblePosts.push(...visible);
      offset += batch.length;
    }

    const data = visiblePosts.map((p) => {
      return new PostResponseDto(p);
    });

    return {
      success: true,
      data,
      meta: {
        page,
        pageSize: limit,
        hasNext: visiblePosts.length === limit,
      },
    };
  }

  private estimateNextBatchSize(remaining: number): number {
    const minimumBatchSize = this.DEFAULT_BATCH_SIZE;
    return Math.max(remaining * 2, minimumBatchSize);
  }

  //   private async fetchNextBatch(
  //     userId: string,
  //     skip: number,
  //     take: number,
  //   ): Promise<PostEntity[]> {
  //     const { data } = await this.postQueryRepository.findFollowingUsersPosts(
  //       userId,
  //       {
  //         skip,
  //         take,
  //       },
  //     );
  //     return data;
  //   }

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
