"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { links } from "@/lib/content";
import { hash } from "@/lib/dither";
import { DitherCanvas, type Tone } from "./dither-canvas";
import { DitherImage } from "./dither-image";
import { useSite } from "./providers";

// Drop cover files in public/img/music/ and set the path here; until then a generated dither tile stands in.
const covers: (string | undefined)[] = [undefined, undefined, undefined, undefined, undefined];
// Drop photos in public/img/ and list their paths here.
const photos: string[] = [];
const NOW_PLAYING = { title: "Cyberpunk 2077", art: "/img/games/cyberpunk-2077.jpg" };

// One generated pattern per record, so each stand-in cover reads differently.
const coverTones: Tone[] = [
  (x, y, w, h) => 0.5 + 0.5 * Math.sin(Math.hypot(x - w / 2, y - h / 2) * 0.9), // rings
  (x, y) => ((x + y) % 14 < 5 ? 0.9 : 0.2), // diagonal stripes
  (x, y) => (x % 12 < 2 || y % 12 < 2 ? 0.95 : hash(x, y) * 0.25), // neon grid
  (x, y) => 0.5 + 0.5 * Math.sin(x * 0.35 + Math.sin(y * 0.2) * 2), // waves
  (x, y, w, h) => 0.5 + 0.5 * Math.sin(Math.atan2(y - h / 2, x - w / 2) * 7), // spokes
];
const coverInks = ["magi", "ghost", "haptic", "laaf", "sophiel"];

type Day = { date: string; count: number; level: number };
type Stats = { days: Day[]; year: number; commits?: number; prs?: number; repos?: number };

const user = links.github.split("/").pop()!;
const gh = (url: string) =>
  fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

// The carousel renders its slides three times; one shared request keeps GitHub's rate limit safe.
let pending: Promise<Stats> | null = null;
const loadStats = () => (pending ??= fetchStats().catch((e) => ((pending = null), Promise.reject(e))));

async function fetchStats(): Promise<Stats> {
  try {
    const cached = sessionStorage.getItem("gh-stats");
    if (cached) {
      const { at, stats } = JSON.parse(cached);
      if (Date.now() - at < 30 * 60_000) return stats;
    }
  } catch {}
  // The graph comes from a public mirror of GitHub's contribution calendar (GitHub only serves it behind a token).
  const [graph, commits, prs, profile] = await Promise.allSettled([
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    gh(`https://api.github.com/search/commits?q=author:${user}&per_page=1`),
    gh(`https://api.github.com/search/issues?q=author:${user}+type:pr&per_page=1`),
    gh(`https://api.github.com/users/${user}`),
  ]);
  if (graph.status !== "fulfilled") throw new Error("graph");
  const days: Day[] = graph.value.contributions;
  const stats: Stats = {
    days,
    year: days.reduce((n, d) => n + d.count, 0),
    commits: commits.status === "fulfilled" ? commits.value.total_count : undefined,
    prs: prs.status === "fulfilled" ? prs.value.total_count : undefined,
    repos: profile.status === "fulfilled" ? profile.value.public_repos : undefined,
  };
  try {
    sessionStorage.setItem("gh-stats", JSON.stringify({ at: Date.now(), stats }));
  } catch {}
  return stats;
}

function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

function Music() {
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

const levelColor = [
  "var(--line)",
  "color-mix(in oklab, var(--accent) 30%, var(--line))",
  "color-mix(in oklab, var(--accent) 55%, var(--line))",
  "color-mix(in oklab, var(--accent) 80%, var(--line))",
  "var(--accent)",
];

function Activity() {
  const { t, lang } = useSite();
  const m = t.offcode.more;
  const [state, setState] = useState<Stats | "error" | null>(null);

  useEffect(() => {
    let off = false;
    loadStats().then(
      (stats) => !off && setState(stats),
      () => !off && setState("error"),
    );
    return () => {
      off = true;
    };
  }, []);

  const fmt = (n?: number) => (n === undefined ? "–" : n.toLocaleString(lang));
  const stats = state && state !== "error" ? state : null;
  // Weeks run in columns starting on Sunday, so pad the first column up to the first day's weekday.
  const pad = stats ? new Date(`${stats.days[0].date}T00:00:00Z`).getUTCDay() : 0;
  const items: [string, string][] = stats
    ? [
        [m.statContributions, fmt(stats.year)],
        [m.statCommits, fmt(stats.commits)],
        [m.statPrs, fmt(stats.prs)],
        [m.statRepos, fmt(stats.repos)],
        [m.statStreak, fmt(longestStreak(stats.days))],
      ]
    : [];

  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.activityTitle}</h3>
      <p className="mt-2 text-dim">{m.activityBody}</p>

      <div
        role="img"
        aria-label={m.graphLabel}
        className="mt-5 grid grid-flow-col grid-rows-7 gap-[2px]"
        style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
      >
        {stats
          ? [...Array.from({ length: pad }, () => null), ...stats.days].map((d, i) => (
              <span
                key={i}
                title={d ? `${d.date}: ${d.count}` : undefined}
                className="aspect-square rounded-[2px] transition-transform duration-150 hover:scale-150 motion-reduce:transition-none"
                style={{ background: d ? levelColor[d.level] : "transparent" }}
              />
            ))
          : Array.from({ length: 371 }, (_, i) => (
              <span
                key={i}
                className={`aspect-square rounded-[2px] bg-line ${state === null ? "animate-pulse motion-reduce:animate-none" : "opacity-40"}`}
              />
            ))}
      </div>

      {state === "error" && <p className="mt-4 text-dim">{m.activityEmpty}</p>}
      {stats && (
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
          {items.map(([label, value]) => (
            <div key={label}>
              <dd className="tabular font-display text-3xl font-bold tracking-tight">{value}</dd>
              <dt className="text-sm text-dim">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      <a href={links.github} target="_blank" rel="noreferrer" className="link mt-6 inline-flex items-center gap-1 font-medium">
        {m.activityProfile}
        <ArrowUpRight className="size-4 text-accent-ink" />
      </a>
    </>
  );
}

function Now() {
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

function Photos() {
  const { t } = useSite();
  const m = t.offcode.more;
  return (
    <>
      <h3 className="text-3xl font-bold tracking-tight">{m.photosTitle}</h3>
      <p className="mt-2 text-dim">{m.photosBody}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {(photos.length ? photos : [null, null, null]).map((src, i) =>
          src ? (
            <div key={src} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}>
              <div className="zoom size-full">
                <DitherImage src={src} alt="" color cell={2} className="size-full bg-white" />
              </div>
            </div>
          ) : (
            <div key={i} className={`rounded-2xl border border-dashed border-line ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`} />
          ),
        )}
      </div>
      {!photos.length && <p className="mt-4 text-dim">{m.photosPending}</p>}
    </>
  );
}

export const slideClass = "tile lift snap-start shrink-0 basis-[88%] md:basis-[calc(50%-0.5rem)]";

// Extra panels sit absolutely inside their tile, so only the lead slides set the row's height.
function Extra({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${slideClass} relative`}>
      <div className="absolute inset-0 overflow-y-auto p-6 sm:p-8">{children}</div>
    </div>
  );
}

function Slides({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Extra>
        <Music />
      </Extra>
      <Extra>
        <Activity />
      </Extra>
      <Extra>
        <Now />
      </Extra>
      <Extra>
        <Photos />
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

  const arrow = "btn btn-ghost grid size-11 place-items-center p-0";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={m.label}>
      <div
        ref={track}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="contents" inert={copy !== 1} aria-hidden={copy !== 1 || undefined}>
            <Slides>{children}</Slides>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={() => go(-1)} aria-label={m.prev} className={arrow}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={m.next} className={arrow}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
