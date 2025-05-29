import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeleteFollowUseCase {
  constructor(private readonly followRepo: FollowRepository) {}

  async execute(id: string): Promise<void> {
    const item = await this.followRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.FollowNotFound(id));
    }
    await this.followRepo.delete(id);
  }
}
