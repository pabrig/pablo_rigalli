"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  applyReading,
  DEFAULT_READING,
  READING_STORAGE_KEY,
  readReadingPrefs,
  type ReadingPrefs
} from "./reading-prefs";

type ReadingContextValue = {
  prefs: ReadingPrefs;
  update: (partial: Partial<ReadingPrefs>) => void;
  reset: () => void;
};

const ReadingContext = createContext<ReadingContextValue | null>(null);

function persist(next: ReadingPrefs) {
  applyReading(next);
  window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(next));
}

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ReadingPrefs>(DEFAULT_READING);

  useLayoutEffect(() => {
    const stored = readReadingPrefs();
    setPrefs(stored);
    applyReading(stored);
  }, []);

  const update = useCallback((partial: Partial<ReadingPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_READING);
    persist(DEFAULT_READING);
  }, []);

  const value = useMemo(() => ({ prefs, update, reset }), [prefs, update, reset]);

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
}

export function useReading() {
  const ctx = useContext(ReadingContext);
  if (!ctx) throw new Error("useReading must be used within ReadingProvider");
  return ctx;
}
