"use client";

import { useEffect, useState } from "react";
import { loadSteam, type SteamStatus, steamBanner } from "@/lib/steam";
import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Shown when the Steam endpoint is unreachable (local dev, no key, Steam down). Set by hand.
const FALLBACK = { title: "Cyberpunk 2077", art: "/img/games/cyberpunk-2077.jpg" };

export function NowPlayingPanel() {
  const { t } = useSite();
  const m = t.offcode.more;
  const [steam, setSteam] = useState<SteamStatus | null>(null);

  useEffect(() => {
    let off = false;
    loadSteam().then(
      (s) => !off && setSteam(s),
      () => {},
    );
    return () => {
      off = true;
    };
  }, []);

  // Headline game: what is running now, else the most recently played one, else the hand-set fallback.
  const game = steam?.current ?? steam?.recent[0] ?? null;
  const title = game?.name ?? FALLBACK.title;
  const art = game ? steamBanner(game.appid) : FALLBACK.art;
  const label = !steam ? m.nowBody : steam.status === "in-game" ? m.nowPlaying : steam.status === "online" ? m.nowOnline : m.nowLast;
  const others = steam?.recent.filter((g) => g.appid !== game?.appid).slice(0, 3) ?? [];

  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.nowTitle}</h3>
      <p className="mt-2 text-dim">{label}</p>
      <div className="mt-5 overflow-hidden rounded-2xl">
        <div className="zoom">
          <DitherImage key={art} src={art} alt="" color cell={2} className="aspect-460/215 w-full bg-white" />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
        <span
          aria-hidden
          className={`size-2 shrink-0 rounded-full ${!steam || steam.status === "offline" ? "bg-dim" : "bg-accent"}`}
        />
        <span className="truncate">{title}</span>
      </p>
      {others.length > 0 && (
        <ul className="mt-3 divide-y divide-line text-sm">
          {others.map((g) => (
            <li key={g.appid} className="flex items-baseline justify-between gap-3 py-2">
              <span className="truncate">{g.name}</span>
              <span className="tabular shrink-0 text-dim">
                {g.hours} {m.nowHours}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
