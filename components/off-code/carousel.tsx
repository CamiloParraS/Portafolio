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

/** Distance between neighbouring slides, and the width of one full set (first slide of copy 0 to copy 1). */
function measureTrack(el: HTMLElement) {
  const left = (n?: Element | null) => (n as HTMLElement | null | undefined)?.offsetLeft;
  const [a, b] = [el.children[1]?.children[0], el.children[1]?.children[1]];
  const step = a && b ? left(b)! - left(a)! : 0;
  const first = left(el.children[0]?.firstElementChild);
  const middle = left(el.children[1]?.firstElementChild);
  return { step, period: first !== undefined && middle !== undefined ? middle - first : 0 };
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

  // Layout is measured on resize only (never inside the scroll handler) and read from this ref.
  const metrics = useRef({ step: 0, period: 0 });

  const goTo = (i: number) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { period, step } = metrics.current;
    track.current?.scrollTo({ left: period + i * step, behavior: reduced ? "auto" : "smooth" });
  };

  useLayoutEffect(() => {
    const el = track.current!;
    el.scrollLeft = measureTrack(el).period;
    metrics.current = measureTrack(el);
    let timer = 0;
    const settle = () => {
      const p = metrics.current.period;
      if (!p) return;
      if (el.scrollLeft < p) el.scrollLeft += p;
      else if (el.scrollLeft >= 2 * p) el.scrollLeft -= p;
    };
    const onScroll = () => {
      const { step, period } = metrics.current;
      if (step) setActive((((Math.round((el.scrollLeft - period) / step) % count) + count) % count));
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 120);
    };
    const ro = new ResizeObserver(() => {
      metrics.current = measureTrack(el);
      const p = metrics.current.period;
      el.scrollLeft = p + (el.scrollLeft % (p || 1));
    });
    ro.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.children[0]?.firstElementChild as HTMLElement | undefined;
    if (!el || !first) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (first.offsetWidth + 16), behavior: reduced ? "auto" : "smooth" });
  };

  const arrow = "btn btn-ghost grid size-8 place-items-center p-0 pointer-coarse:size-10";

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
              className="group grid h-6 flex-1 place-items-center transition-transform duration-150 ease-out active:scale-90 pointer-coarse:h-10 sm:max-w-12"
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
