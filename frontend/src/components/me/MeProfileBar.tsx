'use client';

import { ReactNode } from 'react';
import UserLine from '@/components/user/UserLine';

export type MeProfileBarProps = {
  name?: string;
  subtitle?: string;
  followersCount?: number;
  followingCount?: number;

  /** 右側に差し込む任意アクション（フォローボタン等） */
  action?: ReactNode;

  // RemoteBoundary 用
  loading?: boolean;
  error?: string;
};

function formatCount(n?: number) {
  return typeof n === 'number' ? String(n) : '-';
}

export default function MeProfileBar({
  name,
  subtitle,
  followersCount,
  followingCount,
  action,
  loading,
  error,
}: MeProfileBarProps) {
  // loading / error は省スペースのまま表示
  if (loading) {
    return (
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="h-3 w-40 rounded bg-gray-200" />
        </div>
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full truncate text-xs text-rose-700">
        プロフィールの取得に失敗しました：{error}
      </div>
    );
  }

  return (
    <UserLine
      name={name ?? '（名前未設定）'}
      subtitle={subtitle}
      size="sm"
      className="w-full"
    >
      {/* 右側：フォロー/フォロワー + 任意アクション */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <span className="hidden sm:inline">フォロー</span>
            <span className="font-semibold tabular-nums text-gray-900">
              {formatCount(followingCount)}
            </span>
          </div>
          <div className="inline-flex items-center gap-1">
            <span className="hidden sm:inline">フォロワー</span>
            <span className="font-semibold tabular-nums text-gray-900">
              {formatCount(followersCount)}
            </span>
          </div>
        </div>

        {/* ここにボタンなどを差し込める */}
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </UserLine>
  );
}
