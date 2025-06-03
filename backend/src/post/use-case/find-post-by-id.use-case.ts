import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';

@Injectable()
export class FindPostByIdUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly visibilityEvaluator: EvaluateVisibilityForPost,
  ) {}

  async execute(userId: string, id: string) {
    const item = await this.postRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.PostNotFound(id));
    }

    const canView = await this.visibilityEvaluator.execute(item, userId);
    if (!canView) {
      throw new NotFoundException(ErrorMessage.PostNotFound(id));
    }
    return item;
  }
}
