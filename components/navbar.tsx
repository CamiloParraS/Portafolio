"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "./providers";

const ids = ["work", "about", "record", "offcode", "contact"] as const;

export function Navbar() {
  const { t, toggleLang, theme, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconBtn = "grid size-10 place-items-center rounded-xl text-ink transition-colors hover:bg-ground";

  return (
    <header className="sticky top-3 z-50 px-4 sm:top-4 sm:px-6">
      <a href="#main" className="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-2">
        {t.nav.skip}
      </a>
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-line bg-tile/85 pr-2 pl-5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md"
      >
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <span aria-hidden className="grid size-5 grid-cols-2 gap-[2px]">
            <span className="rounded-[2px] bg-accent" />
            <span className="rounded-[2px] bg-accent/40" />
            <span className="rounded-[2px] bg-accent/40" />
            <span className="rounded-[2px] bg-accent" />
          </span>
          camilo parra
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {ids.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className="rounded-xl px-3 py-2 text-sm text-dim transition-colors hover:bg-ground hover:text-ink">
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button type="button" onClick={toggleLang} aria-label={t.nav.lang} className={`${iconBtn} text-sm font-semibold`}>
            {t.nav.langShort}
          </button>
          <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t.nav.toLight : t.nav.toDark} className={iconBtn}>
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className={`${iconBtn} md:hidden`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="tile mx-auto mt-2 grid max-w-6xl gap-1 p-2 md:hidden">
          {ids.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg font-medium hover:bg-ground">
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
