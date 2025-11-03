// ランタイム無し（'use client' 付けない）

import type { ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const AVATAR_SIZE_CLASS = {
  xs: 'h-5 w-5', // 20px
  sm: 'h-6 w-6', // 24px
  md: 'h-8 w-8', // 32px
  lg: 'h-10 w-10', // 40px
  xl: 'h-12 w-12', // 48px
} as const satisfies Record<AvatarSize, string>;

export type Rounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

export const ROUNDED_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
} as const satisfies Record<Rounded, string>;

export function initials(name?: string | null, fallback = '??') {
  const t = (name ?? '').trim();
  return t ? t.slice(0, 2).toUpperCase() : fallback;
}

export type UserIdentity = {
  /** 表示名 */
  name: string;
  /** 画像URL（null/未定義なら頭文字表示） */
  src?: string | null;
  /** 画像の alt。未指定なら name を使う */
  alt?: string;
};

export type AvatarStyleProps = {
  size?: AvatarSize;
  rounded?: Rounded;
  className?: string;
};

export type UserAvatarProps = UserIdentity & AvatarStyleProps;

export type UserLineProps = UserAvatarProps & {
  /** サブテキスト（@handle など） */
  subtitle?: string;
  /** 右側に配置する任意コンテンツ（ボタン等） */
  children?: ReactNode;
};
