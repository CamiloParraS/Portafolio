"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useRef } from "react";
import { BladeMenu, sections, useActiveSection } from "./blade-menu";
import { useSite } from "./providers";

/** EN/ES and Day/Midnight toggles; shared by the navbar and the desktop hero. */
export function SiteControls() {
  const { t, lang, toggleLang, theme, toggleTheme } = useSite();
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleLang}
        aria-label={t.nav.lang}
        className="mono h-10 px-3 text-sm text-ink transition-colors hover:text-accent-ink"
      >
        <span className={lang === "en" ? "text-accent-ink" : ""}>EN</span>
        <span className="px-1 text-ink-dim">/</span>
        <span className={lang === "es" ? "text-accent-ink" : ""}>ES</span>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "night" ? t.nav.toDay : t.nav.toNight}
        className="grid size-10 place-items-center text-ink transition-colors hover:text-accent-ink"
      >
        {theme === "night" ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </button>
    </div>
  );
}

/** First tab stop on the page: straight to the work. */
export function SkipLink() {
  const { t } = useSite();
  return (
    <a
      href="#work"
      className="blade sr-only bg-accent px-6 py-2 font-semibold text-on-accent no-underline focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
    >
      {t.nav.skip}
    </a>
  );
}

export function Navbar() {
  const { t, theme } = useSite();
  const active = useActiveSection();
  const dialog = useRef<HTMLDialogElement>(null);
  const hour = sections.find((s) => s.id === active)?.hour ?? "00:00";

  return (
    // On desktop the hero carries its own menu and controls, so the bar slides in only once you leave it.
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ground/80 backdrop-blur-md transition-[translate,visibility] duration-500 ease-out-expo ${
        active ? "" : "lg:invisible lg:-translate-y-full"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-(--gutter)">
        <a href="#top" className="display flex items-baseline gap-3 text-2xl no-underline">
          <span>Camilo Parra</span>
          <span className="mono hidden text-sm font-normal not-italic text-accent-ink sm:inline">
            {hour} · {theme === "night" ? t.nav.night : t.nav.day}
          </span>
        </a>

        <BladeMenu className="ml-auto hidden lg:flex" itemClassName="text-xl" />
        <div className="hidden lg:ml-2 lg:block">
          <SiteControls />
        </div>

        <div className="ml-auto flex items-center lg:hidden">
          <SiteControls />
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-label={t.nav.menu}
            className="grid size-10 place-items-center text-ink"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <dialog
        ref={dialog}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ground p-0 text-ink backdrop:bg-ground"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="flex h-16 items-center justify-between px-(--gutter)">
          <span className="mono text-sm text-accent-ink">{hour}</span>
          <div className="ml-auto mr-1">
            <SiteControls />
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={t.nav.close}
            className="grid size-10 place-items-center"
          >
            <X className="size-6" />
          </button>
        </div>
        <BladeMenu
          vertical
          subs
          className="tilt mt-10 gap-3 px-8"
          itemClassName="text-[clamp(2.25rem,10vw,4.5rem)]"
          onPick={() => dialog.current?.close()}
        />
      </dialog>
    </header>
  );
}
