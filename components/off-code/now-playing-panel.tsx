"use client";

import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Set this by hand to whatever is on screen right now.
const NOW_PLAYING = { title: "Cyberpunk 2077", art: "/img/games/cyberpunk-2077.jpg" };

export function NowPlayingPanel() {
  const { t } = useSite();
  const m = t.offcode.more;
  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.nowTitle}</h3>
      <p className="mt-2 text-dim">{m.nowBody}</p>
      <div className="mt-5 overflow-hidden rounded-2xl">
        <div className="zoom">
          <DitherImage src={NOW_PLAYING.art} alt="" color cell={2} className="aspect-460/215 w-full bg-white" />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
        <span aria-hidden className="size-2 rounded-full bg-accent" />
        {NOW_PLAYING.title}
      </p>
    </>
  );
}
