import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { VisibilityContext } from '../context/visibility-context';
import { ViewRule } from '../engine/view-rule.interface';
import { FollowEntity } from 'src/follow/entity/follow.entity';

/**
 * FollowRule は、フォロー関係に基づいて投稿の閲覧可否を判定するルールです。
 *
 * ## 対応する設定項目:
 * - followers_only: フォロワーのみ閲覧可
 * - follow_back_only: 相互フォローであること
 * - min_follow_days: 一定日数以上フォローしている必要あり
 * - max_follow_days: フォローしてから一定日数以内のユーザーのみ許可
 *
 * ## 判定の流れ:
 * 1. 該当設定が一つもなければスキップ（shouldEvaluate）
 * 2. viewer が post の投稿者をフォローしていなければ拒否
 * 3. min/max 日数の条件を満たさなければ拒否
 * 4. follow_back_only が true の場合、相互フォローでなければ拒否
 * 5. すべての条件を満たせば許可
 */
export class FollowRule implements ViewRule {
  constructor(private readonly usecase: FindFollowRelationUseCase) {}

  private viewerToPostOwnerFollow: FollowEntity | null = null;
  type = 'allow' as const;

  async evaluate(ctx: VisibilityContext): Promise<boolean> {
    const { viewerId, postOwnerId } = ctx;
    // 投稿主をフォローしている必要がある
    await this.findViewerToPostOwnerFollow(viewerId, postOwnerId);
    if (!this.isFollowToPostOwner()) return false;

    const { min_follow_days, max_follow_days } = ctx.setting;
    // フォロー期間条件（最小・最大日数）を確認
    if (
      min_follow_days !== undefined &&
      !this.isFollowedLongEnough(min_follow_days)
    )
      return false;
    if (
      max_follow_days !== undefined &&
      !this.isFollowedRecently(max_follow_days)
    )
      return false;

    // 相互フォロー条件が無効なら、これまでの条件を通過しているので許可
    const follow_back_only = ctx.setting.follow_back_only;
    if (!follow_back_only) return true;

    return this.isMutualFollow(viewerId, postOwnerId);
  }

  static shouldEvaluate(ctx: VisibilityContext): boolean {
    const {
      followers_only,
      follow_back_only,
      min_follow_days,
      max_follow_days,
    } = ctx.setting;

    return (
      followers_only === true ||
      follow_back_only === true ||
      min_follow_days !== undefined ||
      max_follow_days !== undefined
    );
  }

  private async findViewerToPostOwnerFollow(
    viewerId: string,
    postOwnerId: string,
  ) {
    const exist = await this.usecase.execute(viewerId, postOwnerId);
    this.viewerToPostOwnerFollow = exist;
  }

  private isFollowToPostOwner(): boolean {
    return !!this.viewerToPostOwnerFollow;
  }

  private getFollowedDays(): number | null {
    const followedAt = this.viewerToPostOwnerFollow?.followedAt;
    if (!followedAt) return null;

    const now = new Date();
    return Math.floor(
      (now.getTime() - followedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  private isFollowedLongEnough(minFollowDays: number): boolean {
    const days = this.getFollowedDays();
    return days !== null && days >= minFollowDays;
  }

  private isFollowedRecently(maxFollowDays: number): boolean {
    const days = this.getFollowedDays();
    return days !== null && days <= maxFollowDays;
  }

  private async findPostOwnerToViewerFollow(
    viewerId: string,
    postOwnerId: string,
  ): Promise<FollowEntity | null> {
    return await this.usecase.execute(postOwnerId, viewerId);
  }

  private async isMutualFollow(
    viewerId: string,
    postOwnerId: string,
  ): Promise<boolean> {
    return (
      (await this.findPostOwnerToViewerFollow(postOwnerId, viewerId)) != null
    );
  }
}
