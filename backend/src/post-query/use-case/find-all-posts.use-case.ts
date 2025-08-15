import { Injectable } from '@nestjs/common';
// import { PostEntity } from 'src/post/entity/post.entity';
import { PostQueryRepository } from '../repository/post-query.repository';
import { VisiblePostsQueryRunner } from './shared/visible-posts-query-runner';
import { PaginatedApiResponse } from 'src/common/response/api-response';
import { PostResponseDto } from 'src/post/dto/post_response.dto';

@Injectable()
export class FindAllPostsUseCase {
  constructor(
    private readonly postQueryRepository: PostQueryRepository,
    private readonly runner: VisiblePostsQueryRunner,
  ) {}

  async execute(
    userId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<PaginatedApiResponse<PostResponseDto>> {
    const fetchBatch = async (skip: number, take: number) => {
      const { data } = await this.postQueryRepository.findAllWithCount({
        skip,
        take,
      });
      return data;
    };

    return await this.runner.run(userId, { page, limit }, fetchBatch);
  }
}
