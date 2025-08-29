'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/feed', label: 'Feed' },
  { href: '/following', label: 'Following' },
]

export default function TabsNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Feed tabs" className="mb-4 border-b">
      <ul className="flex">
        {tabs.map((t) => {
          const active = pathname === t.href
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={[
                  'block text-center py-2 transition',
                  active
                    ? 'font-semibold text-gray-900 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-800'
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {t.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
