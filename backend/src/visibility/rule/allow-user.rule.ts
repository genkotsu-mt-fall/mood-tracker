import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';

export class AllowUserRule implements ViewRule {
  type = 'allow' as const;

  evaluate(ctx: VisibilityContext): boolean {
    const { allow_users } = ctx.setting;
    if (!allow_users) return true;
    return allow_users.includes(ctx.viewerId);
  }
}
