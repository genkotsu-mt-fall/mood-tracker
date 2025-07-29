import { BadRequestException } from '@nestjs/common';
import { validatePrivacySetting } from './privacy-setting.schema';
import { addDays } from '../../../test/utils/date-helper';

describe('Validation behavior of PrivacySettingSchema', () => {
  const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const future = addDays(1);
  const past = addDays(-1);

  //------------------------------------------------------------------------------------
  // 基本構造チェック
  //------------------------------------------------------------------------------------

  // 完全な空オブジェクトは許可する
  it('should accept completely empty object due to .partial()', () => {
    expect(validatePrivacySetting({})).toStrictEqual({});
  });

  it('should return undefined when input is undefined', () => {
    expect(validatePrivacySetting(undefined)).toStrictEqual(undefined);
  });

  // スキーマに合わない構造(無効なプロパティ)は許可しない
  it('should throw default message when no zod issue message is provided', () => {
    expect(() =>
      validatePrivacySetting({ invalid_property: 'unexpected' }),
    ).toThrow(/Unrecognized key:/);
  });

  //------------------------------------------------------------------------------------
  // UUID 配列 (allow_users, deny_users, allow_groups)
  //------------------------------------------------------------------------------------

  // allow_users, deny_users, allow_groups は UUID 形式でない文字列の要素を許可しない
  it('should reject if allow_users contains non-UUID string', () => {
    expect(() => validatePrivacySetting({ allow_users: ['abc'] })).toThrow(
      BadRequestException,
    );
  });

  // allow_users, deny_users, allow_groups は 空の配列を許可しない
  it('should reject if allow_users is empty array', () => {
    expect(() => validatePrivacySetting({ allow_users: [] })).toThrow(
      BadRequestException,
    );
  });

  // allow_users, deny_users, allow_groups は UUID 形式で文字列の要素を許可する
  it('should accept valid UUID array for allow_users', () => {
    expect(validatePrivacySetting({ allow_users: [uuid] })).toBeDefined(); // !== undefined
  });

  //------------------------------------------------------------------------------------
  // enum 型チェック
  //------------------------------------------------------------------------------------

  it('should reject invalid enum value for group_visibility_mode', () => {
    expect(() =>
      validatePrivacySetting({ group_visibility_mode: 'none' }),
    ).toThrow(BadRequestException);
  });

  //------------------------------------------------------------------------------------
  // 日時チェック
  //------------------------------------------------------------------------------------

  it('should reject past datetime for visible_until', () => {
    expect(() => validatePrivacySetting({ visible_until: past })).toThrow(
      /visible_until は過去の日付ではなく、/,
    );
  });

  it('should accept future datetime for visible_until', () => {
    expect(validatePrivacySetting({ visible_until: future })).toBeDefined();
  });

  //------------------------------------------------------------------------------------
  // HH:mm形式チェック
  //------------------------------------------------------------------------------------

  it('should reject malformed HH:mm time', () => {
    expect(() =>
      validatePrivacySetting({
        viewable_time_range: {
          start: '8:00',
          end: '22:00',
        },
      }),
    ).toThrow(/時間は HH:mm 形式で/);
  });

  it('should accept valid HH:mm format', () => {
    expect(
      validatePrivacySetting({
        viewable_time_range: { start: '08:00', end: '22:00' },
      }),
    ).toBeDefined();
  });

  //------------------------------------------------------------------------------------
  // 数値バリデーション
  //------------------------------------------------------------------------------------

  it('should reject negative min_follow_days', () => {
    expect(() => validatePrivacySetting({ min_follow_days: -1 })).toThrow(
      BadRequestException,
    );
  });

  it('should reject if min_follow_days > max_follow_days', () => {
    expect(() =>
      validatePrivacySetting({ max_follow_days: 1, min_follow_days: 2 }),
    ).toThrow(/min_follow_days は max_follow_days 以下/);
  });

  it('should accept min_follow_days equal to max_follow_days', () => {
    expect(
      validatePrivacySetting({ max_follow_days: 5, min_follow_days: 5 }),
    ).toBeDefined();
  });

  //------------------------------------------------------------------------------------
  // comment_activity_filter配下のwithin_days, min_commentsにoptionalが適用されているか
  //------------------------------------------------------------------------------------

  it('should accept comment_activity_filter with only within_days', () => {
    expect(
      validatePrivacySetting({ comment_activity_filter: { within_days: 5 } }),
    ).toBeDefined();
  });
});
