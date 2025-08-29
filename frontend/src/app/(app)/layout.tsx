import type { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import BottomNav from './_components/BottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    // PC: サイドバー + メイン、SP: 通常フロー（BottomNavあり）
    <div className="bg-gray-50 md:flex">
      <Sidebar />

      {/* 残り領域をフルで使う */}
      <div className="flex-1 min-w-0">
        {/* ← ここからはページが自由にレイアウト。幅制限は掛けない */}
        <main className="w-full p-4 md:p-6">{children}</main>
      </div>

      <BottomNav />
    </div>
  )
}
