import { VisibilityContext } from '../context/visibility-context';
import { DenyUserRule } from './deny-user.rule';

describe('DenyUserRule', () => {
  const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  // AllowUserRule が ステートフルになったら要変更
  const rule = new DenyUserRule();

  //------------------------------------------------------------------------------------
  // evaluate チェック
  //------------------------------------------------------------------------------------

  it('should return true when viewerId is in deny_users', () => {
    const ctx: VisibilityContext = {
      setting: { deny_users: [validUuid] },
      viewerId: validUuid,
      postOwnerId: '',
    };
    expect(rule.evaluate(ctx)).toBe(true);
  });

  it('should return false when viewerId is not in deny_users', () => {
    const ctx: VisibilityContext = {
      setting: { deny_users: ['f47ac10b-58cc-4372-a567-0e02b2c3d480'] },
      viewerId: validUuid,
      postOwnerId: '',
    };
    expect(rule.evaluate(ctx)).toBe(false);
  });

  it('should return false when setting.deny_users is undefined', () => {
    const ctx: VisibilityContext = {
      setting: {},
      viewerId: validUuid,
      postOwnerId: '',
    };
    expect(rule.evaluate(ctx)).toBe(false);
  });
});
