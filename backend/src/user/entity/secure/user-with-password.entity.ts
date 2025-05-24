import { UserEntity } from '../user.entity';

export class UserWithPasswordEntity extends UserEntity {
  constructor(
    private readonly hashedPassword: string,
    public readonly id: string,
    public readonly email: string,
    public readonly name?: string,
  ) {
    super(id, email, name ?? undefined);
  }

  getHashedPassword(): string {
    return this.hashedPassword;
  }

  toUserEntity(): UserEntity {
    return new UserEntity(this.id, this.email, this.name ?? undefined);
  }
}
