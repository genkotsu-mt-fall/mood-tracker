"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, Users, Bell, User, Settings } from 'lucide-react'

const NAV = [
  { href: '/feed', label: 'フィード', icon: Home },
  { href: '/explore', label: '探索', icon: Search },
  { href: '/compose', label: '投稿', icon: PlusCircle },
  { href: '/groups', label: 'グループ', icon: Users },
  { href: '/notifications', label: '通知', icon: Bell },
  { href: '/me', label: 'マイページ', icon: User },
  { href: '/settings/profile', label: '設定', icon: Settings },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <footer className="sticky bottom-0 z-10 border-t bg-white md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = isActive(pathname ?? '', item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center text-xs ${active ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Icon className="mb-0.5 h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
