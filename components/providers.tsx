"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { content, type Content, type Lang } from "@/lib/content";

export type Theme = "dark" | "light";

type Ctx = {
  lang: Lang;
  t: Content;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  /** Visitor paused the decorative animation (WCAG 2.2.2); persisted like the theme. */
  paused: boolean;
  togglePaused: () => void;
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

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const readPaused = () => {
  try {
    return localStorage.getItem("motion") === "paused";
  } catch {
    return false;
  }
};

const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const paused = useSyncExternalStore(subscribe, readPaused, () => false);

  // The phone's browser bar follows the site's theme, which can differ from the system's.
  useEffect(() => {
    const color = theme === "dark" ? "#090b0e" : "#f3f6f7";
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
  }, [theme]);

  // Each language is its own pre-rendered page; the hash keeps the visitor on the same section.
  const toggleLang = useCallback(() => {
    const next: Lang = lang === "en" ? "es" : "en";
    save("lang", next);
    // Remember the section in view and how far into it, so the other language opens at the same spot.
    try {
      const probe = window.scrollY + 120;
      let anchor: { id: string; offset: number } | null = null;
      for (const el of document.querySelectorAll<HTMLElement>("main section[id]")) {
        if (el.offsetTop <= probe) anchor = { id: el.id, offset: window.scrollY - el.offsetTop };
      }
      if (anchor) sessionStorage.setItem("lang-scroll", JSON.stringify(anchor));
    } catch {}
    window.location.assign((next === "es" ? "/es" : "/") + window.location.hash);
  }, [lang]);

  // Arriving from a language switch: jump (no smooth scroll) back to where the visitor was.
  useLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem("lang-scroll");
      if (!raw) return;
      sessionStorage.removeItem("lang-scroll");
      const { id, offset } = JSON.parse(raw) as { id: string; offset: number };
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop + offset, behavior: "instant" });
    } catch {}
  }, []);

  // One snapshot cross-fade covers everything, including the canvas art, which cannot transition colours.
  const toggleTheme = useCallback(() => {
    const next = readTheme() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      save("theme", next);
      flushSync(emit);
    };
    if (typeof document.startViewTransition !== "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }, []);

  const togglePaused = useCallback(() => {
    save("motion", readPaused() ? "playing" : "paused");
    emit();
  }, []);

  return (
    <SiteContext.Provider value={{ lang, t: content[lang], toggleLang, theme, toggleTheme, paused, togglePaused }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <Providers>");
  return ctx;
}
