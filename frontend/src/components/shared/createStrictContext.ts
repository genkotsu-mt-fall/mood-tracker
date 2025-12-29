'use client';

import { createContext, useContext } from 'react';

export function createStrictContext<T>(name: string) {
  const Ctx = createContext<T | null>(null);

  function useStrictContext(): T {
    const v = useContext(Ctx);
    if (!v) throw new Error(`${name} must be used within its Provider`);
    return v;
  }

  return [Ctx, useStrictContext] as const;
}
