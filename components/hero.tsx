"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { links } from "@/lib/content";
import { DitherImage } from "./dither-image";
import { ProjectArt } from "./project-art";
import { useSite } from "./providers";

export function Hero() {
  const { t } = useSite();
  const [magi, ghost] = t.work.projects;

  return (
    <section
      id="top"
      aria-label={t.hero.name}
      className="grid gap-3 pt-6 sm:gap-4 md:h-[calc(100svh-6rem)] md:min-h-155 md:max-h-245 md:grid-cols-4 md:grid-rows-[minmax(0,1fr)_auto]"
    >
      {/* The portrait leads: half the bento wide and both rows tall. */}
      <div className="tile relative aspect-square overflow-hidden md:col-span-2 md:row-span-2 md:aspect-auto">
        <DitherImage src="/img/avatar.jpg" alt={t.hero.photoAlt} className="photo-inks size-full" />
      </div>

      <div className="tile relative flex flex-col justify-center p-5 sm:p-8 md:col-span-2">
        <h1 className="text-4xl font-bold tracking-[-0.04em] min-[420px]:text-5xl sm:text-7xl md:text-6xl xl:text-7xl">
          {t.hero.name}
        </h1>
        <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-dim sm:mt-4 sm:text-lg">
          {t.hero.lead}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
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
        <p className="mt-5 flex items-center gap-2 text-sm text-dim">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          {t.hero.open}
        </p>
      </div>

      <a
        href={`#${magi.id}`}
        className="tile on-accent group relative flex min-h-56 flex-col overflow-hidden border-transparent bg-accent text-on-accent"
      >
        <div className="relative min-h-32 flex-1">
          <ProjectArt id="magi" />
        </div>
        <div className="p-6">
          <h2 className="flex items-center justify-between text-3xl font-bold tracking-tight">
            {magi.name}
            <ArrowUpRight className="size-6 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </h2>
          <p className="mt-2 leading-snug">{t.hero.magiLine}</p>
        </div>
      </a>

      <a
        href={`#${ghost.id}`}
        className="tile group relative flex min-h-56 flex-col overflow-hidden transition-colors hover:border-dim"
      >
        <div className="relative min-h-32 flex-1">
          <ProjectArt id="ghost" />
        </div>
        <div className="p-6">
          <h2 className="flex items-center justify-between text-3xl font-bold tracking-tight">
            {ghost.name}
            <ArrowUpRight className="size-6 text-dim transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </h2>
          <p className="mt-2 leading-snug text-dim">{t.hero.ghostLine}</p>
        </div>
      </a>
    </section>
  );
}
