"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type RightPanelState = {
  open: boolean;
  title?: string;
  content?: ReactNode;
  show: (content: ReactNode, opts?: { title?: string }) => void;
  hide: () => void;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<RightPanelState | null>(null);

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [content, setContent] = useState<ReactNode>(null);
  const pathname = usePathname();

  const show: RightPanelState["show"] = (node, opts) => {
    setContent(node);
    setTitle(opts?.title);
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setContent(null);
    setTitle(undefined);
  };

  // ルート遷移時に右パネルを自動で閉じる
  useEffect(() => {
    hide();
  }, [pathname]);

  // openがfalseになったらcontentもnullにする
  useEffect(() => {
    if (!open) {
      setContent(null);
      setTitle(undefined);
    }
  }, [open]);

  return (
    <Ctx.Provider value={{ open, title, content, show, hide, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRightPanel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRightPanel must be used within RightPanelProvider");
  return ctx;
}
