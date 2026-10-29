"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSite } from "./providers";

const ids = ["work", "about", "record", "offcode", "contact"] as const;

export function Navbar() {
  const { t, toggleLang, theme, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof ids)[number] | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Scroll spy: the last section whose top has crossed the upper third of the viewport.
  useEffect(() => {
    let raf = 0;
    const spy = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current: (typeof ids)[number] | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(spy));
    spy();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // The pill follows the active link; remeasure when the language changes the label widths.
  useEffect(() => {
    const measure = () => {
      const li = active && links.current[active]?.parentElement;
      if (li) setPill({ x: li.offsetLeft, w: li.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, t]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconBtn =
    "grid size-10 place-items-center rounded-xl text-ink transition-colors hover:bg-ground";

  return (
    <header className="sticky top-3 z-50 px-4 sm:top-4 sm:px-6">
      <a
        href="#main"
        className="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-2"
      >
        {t.nav.skip}
      </a>
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-line bg-tile/85 pr-2 pl-5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
          <img
            src="/img/github.jpg"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-lg ring-1 ring-line"
          />
          camilo parra
        </a>

        <ul className="relative hidden items-center gap-1 md:flex">
          <span
            aria-hidden
            style={{ width: pill.w, translate: `${pill.x}px 0` }}
            className={`pointer-events-none absolute inset-y-0 left-0 my-auto h-9 rounded-xl bg-ground transition-[translate,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
          />
          {ids.map((id) => (
            <li key={id} className="relative">
              <a
                ref={(el) => {
                  links.current[id] = el;
                }}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`block rounded-xl px-3 py-2 text-sm transition-colors duration-300 hover:text-ink ${active === id ? "text-ink" : "text-dim"}`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t.nav.lang}
            className={`${iconBtn} text-sm font-semibold`}
          >
            {t.nav.langShort}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.nav.toLight : t.nav.toDark}
            className={iconBtn}
          >
            {theme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
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
        <ul
          id="mobile-menu"
          className="tile mx-auto mt-2 grid max-w-6xl gap-1 p-2 transition-[opacity,translate] duration-200 ease-out starting:-translate-y-2 starting:opacity-0 motion-reduce:starting:translate-y-0 md:hidden"
        >
          {ids.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-lg font-medium transition-colors hover:bg-ground"
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
