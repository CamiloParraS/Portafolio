"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { content, type Content, type Lang } from "@/lib/content";

export type Theme = "dark" | "light";

type Ctx = {
  lang: Lang;
  t: Content;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
};

const SiteContext = createContext<Ctx | null>(null);

// Preferences live outside React (localStorage + <html data-theme>, set before paint by
// the inline script in layout.tsx); React subscribes to them.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const emit = () => listeners.forEach((l) => l());

const readLang = (): Lang => {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "es" || stored === "en") return stored;
  } catch {}
  return navigator.language.startsWith("es") ? "es" : "en";
};
const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export function Providers({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = content[lang].meta.title;
  }, [lang]);

  const toggleLang = useCallback(() => {
    save("lang", readLang() === "en" ? "es" : "en");
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    save("theme", next);
    emit();
  }, []);

  return (
    <SiteContext.Provider value={{ lang, t: content[lang], toggleLang, theme, toggleTheme }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <Providers>");
  return ctx;
}
