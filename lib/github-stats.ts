// GitHub numbers for the activity panel, fetched in the visitor's browser (the site is a static export).

import { links } from "@/lib/content";

export type Day = { date: string; count: number; level: number };
export type Stats = { days: Day[]; year: number; commits?: number; prs?: number; repos?: number };

const user = links.github.split("/").pop()!;
const gh = (url: string) =>
  fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

// The carousel renders its slides three times; one shared request keeps GitHub's rate limit safe.
let pending: Promise<Stats> | null = null;
export const loadStats = () => (pending ??= fetchStats().catch((e) => ((pending = null), Promise.reject(e))));

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

export function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}
