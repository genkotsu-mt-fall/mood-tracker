import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { buildVisibilityRules } from '../engine/build-visibility-rules';
import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';
import { PostEntity } from 'src/post/entity/post.entity';
import { buildVisibilityContext } from './build-visibility-context';
import { evaluateVisibility } from '../engine/evaluate-visibility';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EvaluateVisibilityForPost {
  private rulesFactory: ReturnType<typeof buildVisibilityRules>;

  constructor(
    findFollowRelationUseCase: FindFollowRelationUseCase,
    findGroupIdsByMemberIdUseCase: FindGroupIdsByMemberIdUseCase,
  ) {
    this.rulesFactory = buildVisibilityRules({
      findFollowRelationUseCase,
      findGroupIdsByMemberIdUseCase,
    });
  }

  async execute(post: PostEntity, viewerId: string): Promise<boolean> {
    // 投稿者本人は無条件で閲覧可
    if (post.userId === viewerId) return true;

    const context = buildVisibilityContext(post, viewerId);
    const rules = this.rulesFactory(context);
    return await evaluateVisibility(context, rules);
  }
}
