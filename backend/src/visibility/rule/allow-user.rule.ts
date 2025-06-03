import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';

export class AllowUserRule implements ViewRule {
  type = 'allow' as const;

  evaluate(ctx: VisibilityContext): boolean {
    return ctx.setting.allow_users?.includes(ctx.viewerId) ?? false;
  }
}
