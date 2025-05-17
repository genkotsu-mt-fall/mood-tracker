import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(ErrorMessage.UserNotFound(id));
    }
    await this.userRepo.delete(id);
  }
}
