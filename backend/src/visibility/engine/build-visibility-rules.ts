import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { VisibilityContext } from '../context/visibility-context';
import { AllowUserRule } from '../rule/allow-user.rule';
import { DenyUserRule } from '../rule/deny-user.rule';
import { FollowRule } from '../rule/follow.rule';
import { GroupMembershipRule } from '../rule/group-membership.rule';
import { ScheduledRule } from '../rule/scheduled.rule';
import { ViewRule } from './view-rule.interface';
import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';

/**
 * usecaseはシングルトンなので毎回渡す必要はない。
 * ルールのうち一部はI/Oや状態を持つため、VisibilityContextごとにインスタンスを生成。
 * ただし、usecaseがステートフルになった場合はこの設計を見直すこと。
 */
export function buildVisibilityRules(deps: {
  findFollowRelationUseCase: FindFollowRelationUseCase;
  findGroupIdsByMemberIdUseCase: FindGroupIdsByMemberIdUseCase;
}): (ctx: VisibilityContext) => ViewRule[] {
  const { findFollowRelationUseCase, findGroupIdsByMemberIdUseCase } = deps;
  return (ctx) => {
    const rules: ViewRule[] = [new DenyUserRule(), new AllowUserRule()];

    if (FollowRule.shouldEvaluate(ctx))
      rules.push(new FollowRule(findFollowRelationUseCase));

    if (GroupMembershipRule.shouldEvaluate(ctx))
      rules.push(new GroupMembershipRule(findGroupIdsByMemberIdUseCase));

    if (ScheduledRule.shouldEvaluate(ctx)) rules.push(new ScheduledRule());

    return rules;
  };
}
