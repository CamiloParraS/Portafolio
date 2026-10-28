"use client";

import { ArrowUpRight } from "lucide-react";
import { CAR_PALETTES, garageArt } from "@/lib/art";
import { DitherCanvas } from "./dither-canvas";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";
import { Section } from "./section";

// Steam store banners, keyed by the titles in lib/content.ts (the same in both languages).
const gameArt: Record<string, string> = {
  "Cyberpunk 2077": "/img/games/cyberpunk-2077.jpg",
  Skyrim: "/img/games/skyrim.jpg",
  Oblivion: "/img/games/oblivion.jpg",
  "Metal Gear": "/img/games/metal-gear.jpg",
  Forza: "/img/games/forza.jpg",
};

export function OffCode() {
  const { t } = useSite();
  const o = t.offcode;

  return (
    <Section id="offcode" title={o.title} intro={o.intro}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-6">
        <article className="tile flex flex-col overflow-hidden md:col-span-3">
          <div className="relative h-52">
            <DitherCanvas tone={garageArt} palette={CAR_PALETTES} />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h3 className="text-3xl font-bold tracking-tight">{o.carsTitle}</h3>
            <p className="mt-3 max-w-[48ch] leading-relaxed text-dim">{o.carsBody}</p>
            <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
              {o.carsRepos.map((r) => (
                <li key={r.name}>
                  <a href={r.href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1 font-medium">
                    {r.name}
                    <ArrowUpRight className="size-4 text-accent-ink" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="tile p-6 sm:p-8 md:col-span-3">
          <h3 className="text-3xl font-bold tracking-tight">{o.gamesTitle}</h3>
          <p className="mt-2 text-dim">{o.gamesBody}</p>
          <ul className="mt-5 divide-y divide-line">
            {o.games.map((g) => (
              <li key={g} className="flex items-center justify-between gap-4 py-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {g}
                <DitherImage src={gameArt[g]} alt="" color cell={2} className="aspect-[460/215] w-28 shrink-0 rounded-lg bg-white sm:w-32" />
              </li>
            ))}
          </ul>
        </article>

        <article className="tile grid overflow-hidden sm:grid-cols-3 md:col-span-6">
          <DitherImage src="/img/Nintedo64.jpg" alt={o.originAlt} color cell={2} className="min-h-48 bg-white" />
          <div className="flex flex-col justify-center p-6 sm:col-span-2 sm:p-10">
            <h3 className="text-3xl font-bold tracking-tight">{o.originTitle}</h3>
            <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-dim">{o.originBody}</p>
          </div>
        </article>
      </div>
    </Section>
  );
}
