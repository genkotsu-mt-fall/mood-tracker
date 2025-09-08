import type { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import BottomNav from './_components/BottomNav'
import { RightPanelProvider } from '@/app/(app)/_components/right-panel/RightPanelContext';
import RightPanel from './_components/right-panel/RightPanel'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RightPanelProvider>
      <div className="bg-gray-50 min-h-dvh flex flex-col md:flex-row">
        <Sidebar />

        {/* 中央カラム：縦に伸びる器（高さの伝播に必要） */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* ★ 固定ボトムナビに隠れないよう、64px + セーフエリア分の下パディング */}
          <main className="w-full px-4 md:px-6 pt-4 md:pt-6 flex-1 min-h-0 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
            {children}
          </main>
        </div>

        <BottomNav />
      </div>
      {/* fixed なのでどこに置いてもOK。Providerの配下にあれば良い */}
      <RightPanel />
    </RightPanelProvider>
  )
}
