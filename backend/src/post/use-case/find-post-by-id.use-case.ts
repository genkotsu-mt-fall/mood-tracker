import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class FindPostByIdUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute(id: string) {
    const item = await this.postRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.PostNotFound(id));
    }
    return item;
  }
}
