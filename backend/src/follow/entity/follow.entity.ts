/**
 * フォロー/フォロワー
 */
export class FollowEntity {
  constructor(
    public readonly id: string,
    /**
     * フォローする側のユーザID（自分）
     */
    public readonly followerId: string,
    /**
     * フォローされる側のユーザID（相手）
     */
    public readonly followeeId: string,
    /**
     * フォローした日時
     */
    public readonly followedAt: Date,
  ) {}
}
