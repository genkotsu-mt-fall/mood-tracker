'use client';

import { UserLineProps } from './types';
import UserAvatar from './UserAvatar';

export default function UserLine({
  name,
  src,
  size = 'sm',
  className = '',
  subtitle,
  children, // 右側に配置するアクション等（任意）
  alt,
  rounded = 'full',
}: UserLineProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <UserAvatar
        size={size}
        name={name}
        src={src}
        alt={alt}
        rounded={rounded}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{name}</div>
        {subtitle ? (
          <div className="truncate text-xs text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
