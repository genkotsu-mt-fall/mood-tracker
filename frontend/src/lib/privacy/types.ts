export type DeviceType = "mobile" | "desktop";

export type PrivacySetting = {
  allow_users?: string[];
  deny_users?: string[];
  allow_groups?: string[];
  group_visibility_mode?: "any" | "all";
  followers_only?: boolean;
  follow_back_only?: boolean;
  min_follow_days?: number;
  max_follow_days?: number;
  viewable_time_range?: {
    start: string; // "HH:mm"
    end: string; // "HH:mm"
  };
  visible_until?: string; // ISO8601
  visible_after?: string; // ISO8601
  comment_activity_filter?: {
    within_days?: number;
    min_comments?: number;
  };
  device_types?: DeviceType[];
};
