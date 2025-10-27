'use client';
import { X } from 'lucide-react';
import { useRightPanel } from './RightPanelContext';

export default function RightPanel() {
  const { open, hide, title, content } = useRightPanel();

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={hide}
      />
      {/* 右パネル本体 */}
      <aside
        className={`fixed top-0 right-0 z-50 h-svh w-[88vw] max-w-[420px] bg-white border-l shadow-2xl
        transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-medium">{title ?? 'Details'}</h2>
          <button
            onClick={hide}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100svh-49px)]">
          {content}
        </div>
      </aside>
    </>
  );
}
