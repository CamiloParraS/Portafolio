"use client";

import { Download } from "lucide-react";
import { useSyncExternalStore } from "react";
import { links, portrait } from "@/lib/content";
import { BladeMenu } from "./blade-menu";
import { DitherImage } from "./dither";
import { SiteControls } from "./navbar";
import { useSite } from "./providers";

// The current minute, ticking on the client; 0 during server render.
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 10_000);
  return () => clearInterval(id);
};
const useMinute = () =>
  useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / 60_000),
    () => 0,
  );

export function Hero() {
  const { t, lang, theme } = useSite();
  const minute = useMinute();
  const now = minute ? new Date(minute * 60_000) : null;
  const date =
    now?.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }) ?? "";

  return (
    <section
      id="top"
      aria-labelledby="hero-name"
      className="relative isolate flex min-h-svh flex-col overflow-hidden px-(--gutter) pb-8 pt-24 lg:pb-6 lg:pt-8"
    >
      <div
        aria-hidden
        className="display pointer-events-none absolute -left-4 top-14 -z-10 select-none text-[clamp(9rem,30vw,26rem)] leading-none text-deep md:left-4 lg:top-2 lg:text-[min(30vw,58svh)]"
      >
        00:00
      </div>

      {/* Desktop hides the navbar over the hero, so its toggles live here. */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 hidden px-(--gutter) lg:block">
        <div className="mx-auto flex max-w-[90rem] justify-end">
          <div className="pointer-events-auto">
            <SiteControls />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[90rem] flex-1 items-center gap-10 lg:grid-cols-[1.6fr_0.6fr_auto] xl:grid-cols-[1.3fr_0.7fr_auto]">
        <div className="relative z-10 pt-[18vw] lg:pt-0">
          <h1
            id="hero-name"
            className="display tilt origin-left text-[clamp(5rem,13vw,11rem)] lg:text-[min(9vw,16svh)]"
          >
            <span className="block">{t.hero.first}</span>
            <span className="block text-accent-ink">{t.hero.last}</span>
          </h1>
          {/* A ground scrim keeps the sea's particles off the copy. */}
          <div className="-mx-4 mt-8 max-w-[50ch] bg-ground/80 p-4 lg:mt-[3svh]">
            <p className="mono text-sm uppercase text-accent-ink">
              {t.hero.role} <span className="text-ink-dim">·</span>{" "}
              {t.hero.open}
            </p>
            <p className="mt-3 text-lg leading-relaxed text-ink lg:text-[clamp(1rem,2.4svh,1.125rem)]">
              {t.hero.lede}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-5 lg:mt-[3svh]">
            {links.cv ? (
              <a
                href={links.cv}
                download
                className="blade group inline-flex items-center gap-5 bg-ink py-3 pl-7 pr-9 text-ground no-underline transition-colors duration-300 hover:bg-accent hover:text-on-accent"
              >
                <Download className="size-6 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
                <span className="flex flex-col">
                  <span className="display text-3xl">{t.hero.cv}</span>
                  <span className="mono text-xs uppercase">
                    {t.hero.cvSub} · PDF
                  </span>
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="blade pending inline-flex cursor-not-allowed items-center gap-5 bg-deep py-3 pl-7 pr-9 text-left text-ink-dim"
              >
                <Download className="size-6" />
                <span className="flex flex-col">
                  <span className="display text-3xl">{t.hero.cv}</span>
                  <span className="mono text-xs uppercase">
                    {t.hero.cvPending}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        <figure className="relative mx-auto w-[min(72vw,22rem)] lg:w-full lg:max-w-[min(24rem,40svh)]">
          <div className="tilt">
            <div className="aspect-[3/4] bg-ground/60 [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]">
              <DitherImage
                src={portrait}
                alt={t.hero.portraitAlt}
                px={3}
                invert
                className="h-full w-full"
              />
            </div>
          </div>
          <figcaption className="mono mt-2 text-center text-xs uppercase text-ink-dim">
            <span className="pending bg-ground/80 px-1">
              {t.hero.portraitPending}
            </span>
          </figcaption>
        </figure>

        <BladeMenu
          vertical
          className="tilt hidden gap-1 lg:flex lg:pr-6"
          subs
          itemClassName="text-[clamp(1.75rem,min(3vw,4.8svh),3.25rem)]"
        />
      </div>

      <div className="mono mx-auto mt-10 lg:mt-2 flex w-full max-w-[90rem] flex-wrap justify-between gap-x-8 gap-y-2 text-xs uppercase text-ink-dim [&>span]:bg-ground/80 [&>span]:px-2 [&>span]:py-1">
        <span>{t.hero.where}</span>
        <span>
          {date} · {theme === "night" ? t.nav.night : t.nav.day}
        </span>
      </div>
    </section>
  );
}
