import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserDto } from '../dto/update_user.dto';
import { UserEntity } from '../entity/user.entity';
import { ErrorMessage } from 'src/common/errors/error.messages';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(ErrorMessage.UserNotFound(id));
    }
    return await this.userRepo.update(id, data);
  }
}
