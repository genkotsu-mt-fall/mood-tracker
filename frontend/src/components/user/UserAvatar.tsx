'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AVATAR_SIZE_CLASS,
  initials,
  ROUNDED_CLASS,
  UserAvatarProps,
} from './types';

export default function UserAvatar({
  name,
  src,
  size = 'sm',
  className = '',
  alt,
  rounded = 'full',
}: UserAvatarProps) {
  const sizeCls = AVATAR_SIZE_CLASS[size];
  const radius = ROUNDED_CLASS[rounded];
  return (
    <Avatar className={`${sizeCls} ${radius} ${className}`}>
      {src ? <AvatarImage src={src} alt={alt ?? name} /> : null}
      <AvatarFallback aria-label={name}>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
