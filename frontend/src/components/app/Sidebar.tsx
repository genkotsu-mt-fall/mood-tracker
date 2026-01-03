'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Users, User, Settings, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/(auth)/actions';

const NAV = [
  { href: '/feed', label: 'フィード', icon: Home },
  // { href: '/explore', label: '探索', icon: Search },
  { href: '/compose', label: '投稿', icon: PlusCircle },
  { href: '/groups', label: 'グループ', icon: Users },
  // { href: '/notifications', label: '通知', icon: Bell },
  { href: '/me', label: 'マイページ', icon: User },
  { href: '/me/following', label: 'フォロー中', icon: Users },
  { href: '/me/followers', label: 'フォロワー', icon: Users },
  // { href: '/me/insights', label: 'インサイト', icon: Settings },
  { href: '/settings/profile', label: '設定', icon: Settings },
];

function cx(...args: Array<string | false | undefined>) {
  return args.filter(Boolean).join(' ');
}
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="px-4 pb-3 pt-4">
          <div className="text-lg font-extrabold tracking-tight">
            MoodTracker
          </div>
          <div className="mt-1 text-xs text-gray-500">
            あなたの気持ちに向き合うSNS
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname ?? '', item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                <Icon className={cx('h-5 w-5', active && 'opacity-95')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-2 pb-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className={cx(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                'text-red-600 hover:bg-red-50',
              )}
            >
              <LogOut className="h-5 w-5" />
              <span>ログアウト</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
