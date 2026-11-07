"use client";

import { hash } from "@/lib/dither";
import { DitherCanvas, type Tone } from "../dither-canvas";
import { DitherImage } from "../dither-image";
import { useSite } from "../providers";

// Drop cover files in public/img/music/ and set the path here; until then a generated dither tile stands in.
const covers: (string | undefined)[] = [undefined, undefined, undefined, undefined, undefined];

// One generated pattern per record, so each stand-in cover reads differently.
const coverTones: Tone[] = [
  (x, y, w, h) => 0.5 + 0.5 * Math.sin(Math.hypot(x - w / 2, y - h / 2) * 0.9), // rings
  (x, y) => ((x + y) % 14 < 5 ? 0.9 : 0.2), // diagonal stripes
  (x, y) => (x % 12 < 2 || y % 12 < 2 ? 0.95 : hash(x, y) * 0.25), // neon grid
  (x, y) => 0.5 + 0.5 * Math.sin(x * 0.35 + Math.sin(y * 0.2) * 2), // waves
  (x, y, w, h) => 0.5 + 0.5 * Math.sin(Math.atan2(y - h / 2, x - w / 2) * 7), // spokes
];
const coverInks = ["magi", "ghost", "haptic", "laaf", "sophiel"];

export function MusicPanel() {
  const { t } = useSite();
  const m = t.offcode.more;
  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.musicTitle}</h3>
      <p className="mt-2 text-dim">{m.musicBody}</p>
      <ul className="mt-4 divide-y divide-line">
        {m.music.map((a, i) => (
          <li key={a.title} className="flex items-center gap-4 py-2.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white">
              {covers[i] ? (
                <DitherImage src={covers[i]!} alt="" color cell={2} className="size-full" />
              ) : (
                <DitherCanvas tone={coverTones[i % coverTones.length]} cell={3} className={`ink-${coverInks[i % coverInks.length]}`} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold tracking-tight">{a.title}</p>
              <p className="truncate text-sm text-dim">
                {a.artist} · {a.kind}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
