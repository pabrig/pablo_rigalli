"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy, profile, type Lang } from "./content";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof copy;
  profile: typeof profile;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("lang");
    if (fromQuery === "es" || fromQuery === "en") {
      setLangState(fromQuery);
      window.localStorage.setItem("pr-lang", fromQuery);
      document.documentElement.lang = fromQuery === "es" ? "es" : "en";
      return;
    }
    const stored = window.localStorage.getItem("pr-lang");
    if (stored === "es" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored === "es" ? "es" : "en";
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("pr-lang", next);
    document.documentElement.lang = next === "es" ? "es" : "en";
  };

  const value = useMemo(() => ({ lang, setLang, t: copy, profile }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useCopy() {
  const { lang, t, profile } = useLanguage();
  return { lang, t, profile };
}
