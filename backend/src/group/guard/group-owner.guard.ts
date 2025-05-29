import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/type/auth-request';
import { FindGroupByIdUseCase } from '../use-case/find-group-by-id.use-case';

@Injectable()
export class GroupOwnerGuard implements CanActivate {
  constructor(private readonly findGroupByIdUseCase: FindGroupByIdUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const groupId = request.params.id;

    const item = await this.findGroupByIdUseCase.execute(groupId);
    if (item.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this Group');
    }

    return true;
  }
}
