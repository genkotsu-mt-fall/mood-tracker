import { addDays } from '../../../test/utils/date-helper';
import { VisibilityContext } from '../context/visibility-context';
import { ScheduledRule } from './scheduled.rule';

describe('ScheduledRule', () => {
  //------------------------------------------------------------------------------------
  // shouldEvaluateチェック
  //------------------------------------------------------------------------------------

  // it
  // visible_until === undefined &&
  // visible_after === undefined &&
  // viewable_time_range === undefined => false
  it('should return false when visible_until, visible_after, and viewable_time_range are all undefined', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: {},
    };
    expect(ScheduledRule.shouldEvaluate(ctx)).toBe(false);
  });

  // it
  // visible_until !== undefined &&
  // visible_after === undefined &&
  // viewable_time_range === undefined => true
  it('should return true when only visible_until is defined', () => {
    const now = addDays(0);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_until: now },
    };
    expect(ScheduledRule.shouldEvaluate(ctx)).toBe(true);
  });

  // it
  // visible_until === undefined &&
  // visible_after !== undefined &&
  // viewable_time_range === undefined => true
  it('should return true when only visible_after is defined', () => {
    const now = addDays(0);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_after: now },
    };
    expect(ScheduledRule.shouldEvaluate(ctx)).toBe(true);
  });

  // it
  // visible_until === undefined &&
  // visible_after === undefined &&
  // viewable_time_range !== undefined => true
  it('should return true when only viewable_time_range is defined', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    expect(ScheduledRule.shouldEvaluate(ctx)).toBe(true);
  });

  //------------------------------------------------------------------------------------
  // evaluateチェック
  //------------------------------------------------------------------------------------

  // it
  // visible_until !== undefined &&
  // visible_after === undefined &&
  // viewable_time_range === undefined
  // visible_until > now => true
  it('should return true when visible_until is after now', () => {
    const future = addDays(1);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_until: future },
    };
    const rule = new ScheduledRule();
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // visible_until === now => true
  it('should return true when visible_until is exactly equal to now', () => {
    const fixedNow = new Date('2025-06-06T10:00:00.000Z');
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_until: fixedNow.toISOString() },
    };
    const rule = new ScheduledRule(fixedNow);
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // visible_until < now => false
  it('should return false when visible_until is before now', () => {
    const past = addDays(-1);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_until: past },
    };
    const rule = new ScheduledRule();
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // it
  // visible_until === undefined &&
  // visible_after !== undefined &&
  // viewable_time_range === undefined
  // visible_after > now => false
  it('should return false when visible_after is after now', () => {
    const future = addDays(1);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_after: future },
    };
    const rule = new ScheduledRule();
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // visible_after === now => true
  it('should return true when visible_after is exactly equal to now', () => {
    const fixedNow = new Date('2025-06-06T10:00:00.000Z');
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_after: fixedNow.toISOString() },
    };
    const rule = new ScheduledRule(fixedNow);
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // visible_after < now => true
  it('should return true when visible_after is before now', () => {
    const past = addDays(-1);
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { visible_after: past },
    };
    const rule = new ScheduledRule();
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // it
  // visible_until === undefined &&
  // visible_after === undefined &&
  // viewable_time_range !== undefined
  // start: 08:00, end: 22:00, now: 16:00 => true
  it('should return true when now is 16:00 and within range 08:00–22:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T16:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 08:00, end: 22:00, now: 21:59 => true
  it('should return true when now is 21:59 and within range 08:00–22:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T21:59:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 08:00, end: 22:00, now: 22:00 => true
  it('should return true when now is exactly 22:00, the end of the range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T22:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 08:00, end: 22:00, now: 22:01 => false
  it('should return false when now is 22:01 and just after the range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T22:01:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // start: 08:00, end: 22:00, now: 07:59 => false
  it('should return false when now is 07:59 and just before the range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T07:59:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // start: 08:00, end: 22:00, now: 08:00 => true
  it('should return true when now is exactly 08:00, the start of the range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T08:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 08:00, end: 22:00, now: 08:01 => true
  it('should return true when now is 08:01 and within range 08:00–22:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '08:00', end: '22:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T08:01:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 23:59 => true
  it('should return true when now is 23:59 and within overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T23:59:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 00:00 => true
  it('should return true when now is 00:00 and within overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T00:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 00:01 => true
  it('should return true when now is 00:01 and within overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T00:01:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 21:59 => false
  it('should return false when now is 21:59 and before overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T21:59:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // start: 22:00, end: 04:00, now: 22:00 => true
  it('should return true when now is exactly 22:00, the start of overnight range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T22:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 22:01 => true
  it('should return true when now is 22:01 and within overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T22:01:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 03:59 => true
  it('should return true when now is 03:59 and within overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T03:59:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 04:00 => true
  it('should return true when now is exactly 04:00, the end of overnight range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T04:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(true);
  });

  // start: 22:00, end: 04:00, now: 04:01 => false
  it('should return false when now is 04:01 and after overnight range', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T04:01:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(false);
  });

  // start: 22:00, end: 04:00, now: 16:00 => false
  it('should return false when now is 16:00 and outside overnight range 22:00–04:00', () => {
    const ctx: VisibilityContext = {
      viewerId: '',
      postOwnerId: '',
      setting: { viewable_time_range: { start: '22:00', end: '04:00' } },
    };
    const rule = new ScheduledRule(new Date('2025-06-06T16:00:00.000Z'));
    expect(rule.evaluate(ctx)).toBe(false);
  });
});
