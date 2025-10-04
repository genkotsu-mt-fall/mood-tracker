import type { PrivacySetting } from '@/lib/privacy/types';

export type Audience = 'public' | 'followers' | 'mutuals';

export function audienceFromFlags(d: PrivacySetting): Audience {
  return d.follow_back_only
    ? 'mutuals'
    : d.followers_only
      ? 'followers'
      : 'public';
}

export function flagsFromAudience(a: Audience) {
  return a === 'mutuals'
    ? { followers_only: true, follow_back_only: true }
    : a === 'followers'
      ? { followers_only: true, follow_back_only: false }
      : { followers_only: false, follow_back_only: false };
}
