import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from './view-rule.interface';

export async function evaluateVisibility(
  ctx: VisibilityContext,
  rules: ViewRule[],
): Promise<boolean> {
  for (const rule of rules) {
    const result = await rule.evaluate(ctx);
    if (rule.type === 'deny' && result === true) return false;
    if (rule.type === 'allow' && result === true) return true;
  }
  return false;
}
