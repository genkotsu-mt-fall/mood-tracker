"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type RightPanelState = {
  open: boolean;
  title?: string;
  content?: ReactNode;
  show: (content: ReactNode, opts?: { title?: string }) => void;
  hide: () => void;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<RightPanelState | null>(null);

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [content, setContent] = useState<ReactNode>(null);
  const router = useRouter();

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

  // ページ遷移時に右パネルを自動で閉じる
  useEffect(() => {
    setOpen(false);
    setContent(null);
    setTitle(undefined);
  }, [router]);

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
