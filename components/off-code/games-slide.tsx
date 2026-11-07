"use client";

import { DitherImage } from "../dither-image";
import { useSite } from "../providers";
import { slideClass } from "./carousel";

// Steam store banners, keyed by the titles in lib/content.ts (the same in both languages).
const gameArt: Record<string, string> = {
  "Cyberpunk 2077": "/img/games/cyberpunk-2077.jpg",
  Skyrim: "/img/games/skyrim.jpg",
  Oblivion: "/img/games/oblivion.jpg",
  "Metal Gear": "/img/games/metal-gear.jpg",
  Forza: "/img/games/forza.jpg",
};

export function GamesSlide() {
  const { t } = useSite();
  const o = t.offcode;

  return (
    <div className={`${slideClass} p-6 sm:p-8`}>
      <h3 className="text-3xl font-bold tracking-tight">{o.gamesTitle}</h3>
      <p className="mt-2 text-dim">{o.gamesBody}</p>
      <ul className="mt-5 divide-y divide-line">
        {o.games.map((g) => (
          <li
            key={g}
            className="flex items-center justify-between gap-4 py-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {g}
            <DitherImage
              src={gameArt[g]}
              alt=""
              color
              cell={2}
              className="aspect-460/215 w-28 shrink-0 rounded-lg bg-white sm:w-32"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
