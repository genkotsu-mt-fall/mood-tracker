import type { PrivacySetting } from "./types";

// 空・未設定のキーを削る（backend の .partial().strict() に優しい形へ）
export function normalizePrivacySetting(
  draft: PrivacySetting
): PrivacySetting | undefined {
  const out: PrivacySetting = {};

  if (draft.allow_users?.length) out.allow_users = draft.allow_users;
  if (draft.deny_users?.length) out.deny_users = draft.deny_users;
  if (draft.allow_groups?.length) out.allow_groups = draft.allow_groups;
  if (draft.group_visibility_mode)
    out.group_visibility_mode = draft.group_visibility_mode;
  if (draft.followers_only !== undefined)
    out.followers_only = draft.followers_only;
  if (draft.follow_back_only !== undefined)
    out.follow_back_only = draft.follow_back_only;
  if (isFiniteNum(draft.min_follow_days))
    out.min_follow_days = draft.min_follow_days;
  if (isFiniteNum(draft.max_follow_days))
    out.max_follow_days = draft.max_follow_days;

  if (draft.viewable_time_range?.start && draft.viewable_time_range?.end) {
    out.viewable_time_range = {
      start: draft.viewable_time_range.start,
      end: draft.viewable_time_range.end,
    };
  }

  if (draft.visible_after) out.visible_after = draft.visible_after;
  if (draft.visible_until) out.visible_until = draft.visible_until;

  if (
    draft.comment_activity_filter &&
    (isFiniteNum(draft.comment_activity_filter.within_days) ||
      isFiniteNum(draft.comment_activity_filter.min_comments))
  ) {
    out.comment_activity_filter = {
      within_days: draft.comment_activity_filter.within_days,
      min_comments: draft.comment_activity_filter.min_comments,
    };
  }

  if (draft.device_types?.length) out.device_types = draft.device_types;

  return Object.keys(out).length ? out : undefined;
}

const isFiniteNum = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

/** <input type="datetime-local"> の値（ローカル）を ISO8601 に */
export function localDateTimeToISO(
  local: string | undefined
): string | undefined {
  if (!local) return undefined;
  const d = new Date(local);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
