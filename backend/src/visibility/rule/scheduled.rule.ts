import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';

export class ScheduledRule implements ViewRule {
  constructor(
    /**
     * テスト時に現在時刻を固定できるようにするための引数。
     * デフォルトでは実行時の現在時刻が使われる。
     */
    private readonly now: Date = new Date(),
  ) {}

  type = 'allow' as const;

  evaluate(ctx: VisibilityContext): boolean {
    const { visible_until, visible_after } = ctx.setting;

    // まずは、日時に関する期間内に入っているか
    if (visible_until && !this.isBefore(visible_until)) return false;
    if (visible_after && !this.isAfter(visible_after)) return false;

    const { viewable_time_range } = ctx.setting;
    // つぎに、時間帯に関する期間内に入っているか
    if (viewable_time_range && !this.isWithinTimeRange(viewable_time_range))
      return false;

    return true;
  }

  static shouldEvaluate(ctx: VisibilityContext) {
    const { visible_until, visible_after, viewable_time_range } = ctx.setting;

    return Boolean(
      visible_until !== undefined ||
        visible_after !== undefined ||
        viewable_time_range !== undefined,
    );
  }

  private isBefore(visibleUntil: string): boolean {
    const until = new Date(visibleUntil);
    return this.now <= until;
  }

  private isAfter(visibleAfter: string): boolean {
    const after = new Date(visibleAfter);
    return after <= this.now;
  }

  private isWithinTimeRange({
    start,
    end,
  }: {
    start: string;
    end: string;
  }): boolean {
    const nowNumber = this.getCurrentMinutes();
    const startNumber = this.toMinutes(start);
    const endNumber = this.toMinutes(end);

    return this.isInRange(nowNumber, startNumber, endNumber);
  }

  // 13:45 => 825
  private getCurrentMinutes(): number {
    return this.now.getHours() * 60 + this.now.getMinutes();
  }

  // 引数 hh:mm
  private toMinutes(hhmm: string): number {
    const [hour, minute] = hhmm.split(':').map(Number);
    return hour * 60 + minute;
  }

  private isInRange(current: number, start: number, end: number): boolean {
    if (start <= end) {
      // 開始時間と終了時間が通常の順序の場合（例: 08:00〜22:00）
      return start <= current && current <= end;
    } else {
      // 日をまたぐ順序の場合（例: 22:00〜04:00）
      return current >= start || current <= end;
    }
  }
}
