"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const MAX_COMPARE = 4;
const KEY = "oneatlas:compare";

interface CompareCtx {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  set: (slugs: string[]) => void;
  clear: () => void;
  isFull: boolean;
}

const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw).slice(0, MAX_COMPARE));
    } catch {
      /* storage unavailable or corrupted: start empty */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlugs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CompareCtx>(
    () => ({
      slugs,
      has: (s) => slugs.includes(s),
      toggle: (s) =>
        persist(
          slugs.includes(s)
            ? slugs.filter((x) => x !== s)
            : slugs.length >= MAX_COMPARE
              ? slugs
              : [...slugs, s],
        ),
      remove: (s) => persist(slugs.filter((x) => x !== s)),
      set: (next) => persist(next.slice(0, MAX_COMPARE)),
      clear: () => persist([]),
      isFull: slugs.length >= MAX_COMPARE,
    }),
    [slugs, persist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompareList(): CompareCtx {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useCompareList must be used inside CompareProvider");
  return ctx;
}
