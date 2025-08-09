import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { FindPostByIdUseCase } from 'src/post-query/use-case/find-post-by-id.use-case';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.findPostByIdUseCase.execute(userId, id);

    await this.postRepo.delete(id);
  }
}
