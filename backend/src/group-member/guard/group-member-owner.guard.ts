import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/type/auth-request';
import { LoadGroupMemberWithGroupOwnerUseCase } from '../use-case/load-group-member-with-group-owner.use-case';
import { ensureValidUUID } from 'src/common/validate/uuid';

@Injectable()
export class GroupMemberOwnerGuard implements CanActivate {
  constructor(
    private readonly loadGroupMemberWithGroupOwnerUseCase: LoadGroupMemberWithGroupOwnerUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const groupMemberId = request.params.id;

    ensureValidUUID(groupMemberId, 'GroupMember ID');

    const item =
      await this.loadGroupMemberWithGroupOwnerUseCase.execute(groupMemberId);
    if (item.groupOwnerId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to modify this GroupMember',
      );
    }

    return true;
  }
}
