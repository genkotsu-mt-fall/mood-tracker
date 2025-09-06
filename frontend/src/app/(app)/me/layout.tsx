import type { ReactNode } from 'react'

export default function MeLayout({ children }: { children: ReactNode }) {
  // 上と左右のみ相殺（bottomは相殺しない）
  return <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6 h-full">{children}</div>
}
