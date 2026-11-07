"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "../providers";
import { GithubPanel } from "./github-panel";
import { MusicPanel } from "./music-panel";
import { NowPlayingPanel } from "./now-playing-panel";
import { PhotosPanel } from "./photos-panel";

export const slideClass = "tile lift snap-start shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]";

// Extra panels sit absolutely inside their tile, so only the lead slides set the row's height.
function Extra({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${slideClass} relative`}>
      <div className="absolute inset-0 overflow-y-auto p-5 sm:p-6">{children}</div>
    </div>
  );
}

const EXTRAS = 4; // music, GitHub, now playing, photos (see Slides)

function Slides({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Extra>
        <MusicPanel />
      </Extra>
      <Extra>
        <GithubPanel />
      </Extra>
      <Extra>
        <NowPlayingPanel />
      </Extra>
      <Extra>
        <PhotosPanel />
      </Extra>
    </>
  );
}

/**
 * A manual, endless carousel (scroll-snap + buttons, no autoplay). The slides are rendered three times;
 * once scrolling settles, the track jumps by exactly one set so the visitor always sits in the middle copy.
 * The outer copies are inert, so only one set is ever focusable or read by a screen reader.
 */
export function OffCodeCarousel({ children }: { children: React.ReactNode }) {
  const { t } = useSite();
  const m = t.offcode.more;
  const track = useRef<HTMLDivElement>(null);
  const count = Children.count(children) + EXTRAS;
  const [active, setActive] = useState(0);

  // Distance between two neighbouring slides' left edges.
  const step = () => {
    const kids = track.current?.children[1]?.children;
    const a = kids?.[0] as HTMLElement | undefined;
    const b = kids?.[1] as HTMLElement | undefined;
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  };

  const goTo = (i: number) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollTo({ left: period() + i * step(), behavior: reduced ? "auto" : "smooth" });
  };

  // Width of one full set of slides, measured from the first slide of the middle copy.
  const period = () => {
    const el = track.current;
    const first = el?.children[0]?.firstElementChild as HTMLElement | undefined;
    const middle = el?.children[1]?.firstElementChild as HTMLElement | undefined;
    return first && middle ? middle.offsetLeft - first.offsetLeft : 0;
  };

  useLayoutEffect(() => {
    const el = track.current!;
    el.scrollLeft = period();
    let timer = 0;
    const settle = () => {
      const p = period();
      if (!p) return;
      if (el.scrollLeft < p) el.scrollLeft += p;
      else if (el.scrollLeft >= 2 * p) el.scrollLeft -= p;
    };
    const onScroll = () => {
      const s = step();
      if (s) setActive((((Math.round((el.scrollLeft - period()) / s) % count) + count) % count));
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 120);
    };
    const onResize = () => {
      el.scrollLeft = period() + (el.scrollLeft % (period() || 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.children[0]?.firstElementChild as HTMLElement | undefined;
    if (!el || !first) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (first.offsetWidth + 16), behavior: reduced ? "auto" : "smooth" });
  };

  const arrow = "btn btn-ghost grid size-8 place-items-center p-0";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={m.label}>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs tabular-nums text-dim">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="ml-2 flex flex-1 items-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === active || undefined}
              className="group grid h-6 flex-1 place-items-center sm:max-w-12"
            >
              <span
                className={`h-1 w-full rounded-full transition-colors duration-300 ${
                  i === active ? "bg-accent" : "bg-current opacity-20 group-hover:opacity-40"
                }`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(-1)} aria-label={m.prev} className={arrow}>
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={m.next} className={arrow}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div
        ref={track}
        tabIndex={0}
        className="-mt-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pt-1 pb-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="contents" inert={copy !== 1} aria-hidden={copy !== 1 || undefined}>
            <Slides>{children}</Slides>
          </div>
        ))}
      </div>
    </div>
  );
}
