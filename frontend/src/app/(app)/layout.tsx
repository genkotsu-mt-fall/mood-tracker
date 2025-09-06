import type { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import BottomNav from './_components/BottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    // PC: サイドバー + メイン、SP: 通常フロー（BottomNavあり）
    <div className="bg-gray-50 min-h-dvh flex flex-col md:flex-row">
      <Sidebar />

      {/* 中央カラム：縦に伸びる器（高さの伝播に必要） */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        {/* ★ 固定ボトムナビに隠れないよう、64px + セーフエリア分の下パディング */}
  <main className="w-full px-4 md:px-6 pt-4 md:pt-6 flex-1 min-h-0 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>

      {/* 位置はどこでもOK（fixedなので）。可読性のため末尾に置いておく */}
      <BottomNav />
    </div>
  )
}
