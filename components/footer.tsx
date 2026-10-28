"use client";

import { ArrowUp } from "lucide-react";
import { links } from "@/lib/content";
import { GithubIcon } from "./brand-icons";
import { useSite } from "./providers";

export function Footer() {
  const { t, toggleLang, toggleTheme, theme } = useSite();
  return (
    <footer className="relative mt-16 bg-ink text-ground [&_:focus-visible]:outline-ground">
      <div className="mx-auto max-w-[90rem] px-(--gutter) pb-10 pt-16">
        <p className="display text-[clamp(4rem,14vw,12rem)]">01:00</p>
        <p className="display mt-2 text-3xl">{t.footer.end}</p>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-ground/25 pt-6">
          <div className="space-y-2">
            <p className="font-semibold">© 2026 Camilo Parra · Pasto, Colombia</p>
            <p className="text-sm opacity-80">{t.footer.built}</p>
          </div>
          <div className="mono flex flex-wrap items-center gap-6 text-sm uppercase">
            <a href={links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 no-underline hover:underline">
              <GithubIcon className="size-4" /> GitHub
            </a>
            <button type="button" onClick={toggleLang} className="uppercase hover:underline">
              {t.nav.lang}
            </button>
            <button type="button" onClick={toggleTheme} className="uppercase hover:underline">
              {theme === "night" ? t.nav.toDay : t.nav.toNight}
            </button>
            <a href="#top" className="flex items-center gap-2 no-underline hover:underline">
              <ArrowUp className="size-4" /> {t.footer.top}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
