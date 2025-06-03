import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/type/auth-request';
import { FindPostByIdUseCase } from '../use-case/find-post-by-id.use-case';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly findPostByIdUseCase: FindPostByIdUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const postId = request.params.id;

    const post = await this.findPostByIdUseCase.execute(userId, postId);
    if (post.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this post');
    }

    return true;
  }
}
