"use client";

import { useEffect, useState } from "react";
import { loadSteam, type SteamStatus, steamBanner, steamIcon } from "@/lib/steam";
import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Shown when the Steam endpoint is unreachable (local dev, no key, Steam down). Set by hand.
const FALLBACK = { title: "Cyberpunk 2077", art: "/img/games/cyberpunk-2077.jpg" };

function GameIcon({ src, className }: { src: string | null; className: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer
  return <img src={src} alt="" width={32} height={32} loading="lazy" className={`${className} shrink-0 rounded-md`} />;
}

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
  const iconOf = (appid: number) => {
    const g = steam?.recent.find((r) => r.appid === appid);
    return g ? steamIcon(g.appid, g.icon) : null;
  };
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
        <GameIcon src={game ? iconOf(game.appid) : null} className="size-7" />
        <span className="truncate">{title}</span>
      </p>
      {others.length > 0 && (
        <ul className="mt-3 divide-y divide-line text-sm">
          {others.map((g) => (
            <li key={g.appid} className="flex items-baseline justify-between gap-3 py-2">
              <span className="flex min-w-0 items-center gap-2.5">
                <GameIcon src={steamIcon(g.appid, g.icon)} className="size-6" />
                <span className="truncate">{g.name}</span>
              </span>
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
