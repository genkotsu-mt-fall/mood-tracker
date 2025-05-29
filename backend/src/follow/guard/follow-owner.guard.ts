import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/type/auth-request';
import { FindFollowByIdUseCase } from '../use-case/find-follow-by-id.use-case';

@Injectable()
export class FollowOwnerGuard implements CanActivate {
  constructor(private readonly findFollowByIdUseCase: FindFollowByIdUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const followId = request.params.id;

    const item = await this.findFollowByIdUseCase.execute(followId);
    if (item.followerId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this follow');
    }

    return true;
  }
}
