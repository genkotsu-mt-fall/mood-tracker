import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';

export class DenyUserRule implements ViewRule {
  type = 'deny' as const;

  evaluate(ctx: VisibilityContext): boolean {
    return ctx.setting.deny_users?.includes(ctx.viewerId) ?? false;
  }
}
