import { VisibilityContext } from '../context/visibility-context';

export interface ViewRule {
  type: 'allow' | 'deny';
  evaluate(ctx: VisibilityContext): boolean | Promise<boolean>;
}
