"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { content, type Content, type Lang } from "@/lib/content";

export type Theme = "night" | "day";

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
  const stored = localStorage.getItem("lang");
  return stored === "es" || stored === "en" ? stored : navigator.language.startsWith("es") ? "es" : "en";
};
const readTheme = (): Theme => (document.documentElement.dataset.theme === "day" ? "day" : "night");

export function Providers({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);
  const theme = useSyncExternalStore(subscribe, readTheme, () => "night" as Theme);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = content[lang].meta.title;
  }, [lang]);

  const toggleLang = useCallback(() => {
    localStorage.setItem("lang", readLang() === "en" ? "es" : "en");
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = readTheme() === "night" ? "day" : "night";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
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

/** Re-reads a CSS custom property whenever the theme flips. */
export function readColor(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
