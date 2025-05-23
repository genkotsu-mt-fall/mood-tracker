// import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { UserEntity } from '../entity/user.entity';
import { CreateUserInput } from '../type/create-user-input.type';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract create(data: CreateUserInput): Promise<UserEntity>;

  abstract findAllWithCount(pagenation: {
    skip: number;
    take: number;
  }): Promise<{ data: UserEntity[]; total: number }>;

  abstract findById(id: string): Promise<UserEntity | null>;

  abstract update(id: string, data: UpdateUserDto): Promise<UserEntity>;

  abstract delete(id: string): Promise<void>;
}
