import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';
import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';
import { GroupMembershipCollection } from 'src/group-member/entity/group-membership.collection';

/**
 * グループ条件に基づき、閲覧可否を判断するルール。
 * - allow_groups と group_visibility_mode の両方が設定されているときのみ有効。
 * - I/O を伴うため必要な場合にのみインスタンス化される（shouldEvaluate）。
 */
export class GroupMembershipRule implements ViewRule {
  // ToDo: deny_groups も有ったほうが便利
  constructor(private readonly useCase: FindGroupIdsByMemberIdUseCase) {}
  type = 'allow' as const;

  async evaluate(ctx: VisibilityContext): Promise<boolean> {
    const memberships = await this.useCase.execute(ctx.viewerId);
    if (!memberships) return false;

    return this.evaluateGroupVisibility(memberships, ctx);
  }

  static shouldEvaluate(ctx: VisibilityContext): boolean {
    const { allow_groups, group_visibility_mode } = ctx.setting;
    return !!(
      allow_groups?.length &&
      (group_visibility_mode === 'all' || group_visibility_mode === 'any')
    );
  }

  private evaluateGroupVisibility(
    memberships: GroupMembershipCollection,
    ctx: VisibilityContext,
  ): boolean {
    // ToDo: allow_groups と group_visibility_mode が相関関係なら、
    //       フロントエンドが迷わないように
    //       zodスキーマの superRefine() を追加したほうがいい。
    const groupVisibilityMode = ctx.setting.group_visibility_mode!;
    const allowGroups = ctx.setting.allow_groups!;

    if (groupVisibilityMode === 'all') {
      return memberships.belongsAll(allowGroups);
    }

    if (groupVisibilityMode === 'any') {
      return memberships.belongsAny(allowGroups);
    }

    return false;
  }
}
