"use client";

import { ArrowDown, Download } from "lucide-react";
import { links } from "@/lib/content";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";

export function Hero() {
  const { t, lang, theme } = useSite();
  const [magi, ghost] = t.work.projects;

  return (
    <section
      id="top"
      aria-label={t.hero.name}
      className="grid gap-3 pt-6 sm:gap-4 md:h-[calc(100svh-6rem)] md:min-h-155 md:max-h-245 md:grid-cols-4 md:grid-rows-[auto_minmax(0,1fr)]"
    >
      <div className="tile relative flex flex-col justify-center p-5 sm:p-8 md:col-span-3 md:p-10">
        <h1
          style={{ "--i": 0 } as React.CSSProperties}
          className="enter text-4xl font-bold tracking-[-0.04em] min-[420px]:text-5xl sm:text-7xl xl:text-8xl"
        >
          {t.hero.name}
        </h1>
        <p
          style={{ "--i": 1 } as React.CSSProperties}
          className="enter mt-3 max-w-[52ch] text-base leading-relaxed text-dim sm:mt-4 sm:text-lg"
        >
          {t.hero.lead}
        </p>
        <div
          style={{ "--i": 2 } as React.CSSProperties}
          className="enter mt-5 flex flex-wrap gap-3 sm:mt-7"
        >
          {links.cvReady ? (
            <a href={links.cv} download className="btn btn-primary">
              <Download className="size-4.5" />
              {t.hero.cv}
            </a>
          ) : (
            <span className="btn btn-ghost border-dashed text-dim">
              <Download className="size-4.5" />
              {t.hero.cvPending}
            </span>
          )}
          <a href="#work" className="btn btn-ghost">
            {t.hero.work}
          </a>
        </div>
        <p
          style={{ "--i": 3 } as React.CSSProperties}
          className="enter mt-5 flex items-center gap-2 text-sm text-dim"
        >
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          {t.hero.open}
        </p>
      </div>

      {/* The portrait is a companion to the intro, not the lead: one column, same height as the intro. */}
      <div className="tile relative order-first h-72 overflow-hidden sm:h-96 md:order-none md:col-span-1 md:h-auto">
        <DitherImage
          color
          cover
          priority
          focusY={0.1}
          src="/img/avatar.jpg"
          alt={t.hero.photoAlt}
          className="photo-inks size-full"
        />
      </div>

      <a
        href={`#${magi.id}`}
        data-art-host
        className="tile lift on-accent group relative flex min-h-56 md:col-span-2 flex-col overflow-hidden border-transparent bg-accent text-on-accent"
      >
        <div className="relative min-h-32 flex-1">
          <div className="zoom absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/projects/magi/tile-${lang}-${theme}.webp`} alt="" className="size-full object-cover" />
          </div>
        </div>
        <div className="p-6">
          <h2 className="flex items-center justify-between text-3xl font-bold tracking-tight">
            {magi.name}
            <ArrowDown className="size-6 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </h2>
          <p className="mt-2 leading-snug">{t.hero.magiLine}</p>
        </div>
      </a>

      <a
        href={`#${ghost.id}`}
        data-art-host
        className="tile lift group relative flex min-h-56 flex-col overflow-hidden md:col-span-2"
      >
        <div className="relative min-h-32 flex-1">
          <div className="zoom absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/projects/ghost-layer/tile-${theme}.webp`} alt="" className="size-full object-cover" />
          </div>
        </div>
        <div className="p-6">
          <h2 className="flex items-center justify-between text-3xl font-bold tracking-tight">
            {ghost.name}
            <ArrowDown className="size-6 text-dim transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </h2>
          <p className="mt-2 leading-snug text-dim">{t.hero.ghostLine}</p>
        </div>
      </a>
    </section>
  );
}
