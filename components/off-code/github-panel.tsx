"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { links } from "@/lib/content";
import { type Stats, loadStats, longestStreak } from "@/lib/github-stats";
import { useSite } from "../providers";

const levelColor = [
  "var(--line)",
  "color-mix(in oklab, var(--accent-ink) 40%, var(--line))",
  "color-mix(in oklab, var(--accent-ink) 65%, var(--line))",
  "color-mix(in oklab, var(--accent-ink) 85%, var(--line))",
  "var(--accent-ink)",
];

export function GithubPanel() {
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
  const pad = stats
    ? new Date(`${stats.days[0].date}T00:00:00Z`).getUTCDay()
    : 0;
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

      <div
        role="img"
        aria-label={m.graphLabel}
        className="mt-5 grid grid-flow-col grid-rows-7 gap-[2px]"
        style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
      >
        {stats
          ? [...Array.from({ length: pad }, () => null), ...stats.days].map(
              (d, i) => (
                <span
                  key={i}
                  title={d ? `${d.date}: ${d.count}` : undefined}
                  className="aspect-square rounded-[2px] transition-transform duration-150 hover:scale-150 motion-reduce:transition-none"
                  style={{
                    background: d ? levelColor[d.level] : "transparent",
                  }}
                />
              ),
            )
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
              <dd className="tabular font-display text-3xl font-bold tracking-tight">
                {value}
              </dd>
              <dt className="text-sm text-dim">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      <a
        href={links.github}
        target="_blank"
        rel="noreferrer"
        className="link mt-6 inline-flex items-center gap-1 font-medium"
      >
        <ArrowUpRight className="size-4 text-accent-ink" />
      </a>
    </>
  );
}
