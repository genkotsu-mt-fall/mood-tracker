import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorMessage } from 'src/common/errors/error.messages';
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';
import { PostQueryRepository } from '../repository/post-query.repository';

@Injectable()
export class FindPostByIdUseCase {
  constructor(
    private readonly postQueryRepo: PostQueryRepository,
    private readonly visibilityEvaluator: EvaluateVisibilityForPost,
  ) {}

  async execute(userId: string, id: string) {
    const item = await this.postQueryRepo.findById(id);
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
