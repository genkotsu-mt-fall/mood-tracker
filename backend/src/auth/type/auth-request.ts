import { Request } from 'express';
import { UserEntity } from 'src/user/entity/user.entity';

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}
