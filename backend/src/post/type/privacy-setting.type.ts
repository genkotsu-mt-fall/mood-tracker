export type PrivacySetting = {
  /** 公開範囲: カスタム、全体公開、フォロワー限定など */
  // visibility?: 'custom' | 'public';

  /** 特定のユーザーのみ表示許可（ユーザーID配列） */
  allow_users?: string[];

  /** 特定のユーザーを除外（ユーザーID配列） */
  deny_users?: string[];

  /** 指定グループに所属するユーザーのみ許可（グループID配列） */
  allow_groups?: string[];

  /**
   * グループ公開の条件（any: いずれかのグループに属していればOK / all: すべてのグループに属している必要あり）
   */
  group_visibility_mode?: 'any' | 'all';

  /** フォロワーのみに公開 */
  followers_only?: boolean;

  /** 相互フォローのみ公開 */
  follow_back_only?: boolean;

  /** 最小フォロー日数（この日数以上フォローしている必要がある） */
  min_follow_days?: number;

  /**
   * 最大フォロー日数（この日数以下しか経過していないフォロワーにだけ表示）
   * 例: 「新規フォロワーにだけ表示したい」場合など
   */
  max_follow_days?: number;

  /** 表示できる時間帯（例: 08:00〜22:00 の間のみ閲覧可） */
  viewable_time_range?: {
    start: string; // e.g., "08:00"
    end: string; // e.g., "22:00"
  };

  /** 表示終了日時（ISO8601形式） */
  visible_until?: string;

  /** 表示開始日時（ISO8601形式） */
  visible_after?: string;

  /**
   * コメントアクティビティに基づく制限（例: 最近よくコメントしている人だけに見せる）
   */
  comment_activity_filter?: {
    within_days?: number;
    min_comments?: number;
  };

  /** アクセスを許可するデバイスの種類 */
  device_types?: Array<'mobile' | 'desktop'>;
};
