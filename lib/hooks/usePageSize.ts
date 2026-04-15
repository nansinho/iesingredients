"use client";

import { useState, useEffect, useCallback } from "react";

export const PAGE_SIZE_OPTIONS = [20, 50, 100, 500] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

const STORAGE_PREFIX = "admin-page-size:";

export function usePageSize(scope: string, defaultSize: PageSize = 20) {
  const [size, setSize] = useState<PageSize>(defaultSize);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + scope);
    if (!saved) return;
    const n = Number(saved) as PageSize;
    if (PAGE_SIZE_OPTIONS.includes(n)) setSize(n);
  }, [scope]);

  const update = useCallback(
    (n: PageSize) => {
      setSize(n);
      localStorage.setItem(STORAGE_PREFIX + scope, String(n));
    },
    [scope]
  );

  return [size, update] as const;
}
