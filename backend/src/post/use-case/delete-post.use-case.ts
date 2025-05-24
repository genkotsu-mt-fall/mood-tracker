import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute(id: string): Promise<void> {
    const item = await this.postRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.PostNotFound(id));
    }
    await this.postRepo.delete(id);
  }
}
