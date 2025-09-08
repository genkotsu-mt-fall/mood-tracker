import type { ReactNode } from "react";

export default function MeLayout({ children }: { children: ReactNode }) {
  return <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6 h-full">{children}</div>;
}
