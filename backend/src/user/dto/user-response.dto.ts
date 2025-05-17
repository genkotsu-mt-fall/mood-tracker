import { UserEntity } from '../entity/user.entity';

export class UserResponseDto {
  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
  }

  id: string;
  email: string;
  name?: string;
}
