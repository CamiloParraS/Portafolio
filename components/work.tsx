"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { links, projects, type Project } from "@/lib/content";
import { GithubIcon } from "./brand-icons";
import { DitherPlate } from "./dither";
import { MagiDemo } from "./magi-demo";
import { useSite } from "./providers";
import { SectionHead } from "./section-head";

function ProjectLinks({ p, onAccent = false }: { p: Project; onAccent?: boolean }) {
  const { t } = useSite();
  const base = "blade inline-flex items-center gap-2 px-5 py-2 font-semibold no-underline transition-colors duration-300";
  const solid = onAccent ? "bg-on-accent text-accent hover:bg-ink hover:text-ground" : "bg-ink text-ground hover:bg-accent hover:text-on-accent";
  const ghost = onAccent ? "bg-transparent outline outline-1 -outline-offset-1 outline-on-accent hover:bg-on-accent hover:text-accent" : "bg-deep text-ink hover:bg-accent hover:text-on-accent";
  return (
    <div className="flex flex-wrap gap-3">
      <a href={p.repo} target="_blank" rel="noreferrer" className={`${base} ${solid}`}>
        <GithubIcon className="size-4" /> {t.work.repo}
      </a>
      {p.demo ? (
        <a href={p.demo} target="_blank" rel="noreferrer" className={`${base} ${ghost}`}>
          {p.id === "magi" ? <Download className="size-4" /> : <ArrowUpRight className="size-4" />}
          {p.id === "magi" ? t.work.download : t.work.demo}
        </a>
      ) : (
        <span aria-disabled className={`${base} pending cursor-not-allowed bg-transparent text-ink-dim`}>
          {t.work.noDemo}
        </span>
      )}
    </div>
  );
}

export function Work() {
  const { t } = useSite();
  const [flagship, ...rest] = projects;
  const f = t.work.items[flagship.id];

  return (
    <section id="work" aria-labelledby="work-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="work" hour="00:20" title={t.work.title} />

      {/* Rank is inversion: only the flagship is printed on cyan. */}
      <article className="grid gap-10 bg-accent p-6 text-on-accent md:p-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col">
          <h3 className="display tilt origin-left text-[clamp(5rem,12vw,10rem)]">{flagship.name}</h3>
          <p className="display mt-6 text-3xl">{f.tagline}</p>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed">{f.body}</p>
          <p className="mono mt-6 text-sm">
            {f.status} · {flagship.year}
          </p>
          <ul className="mono mt-2 flex flex-wrap gap-x-4 text-sm">
            {flagship.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <ProjectLinks p={flagship} onAccent />
          </div>
        </div>
        <MagiDemo />
      </article>

      <ol className="mt-20 space-y-20 md:space-y-28">
        {rest.map((p, i) => {
          const copy = t.work.items[p.id];
          return (
            <li key={p.id} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-deep">
                <DitherPlate kind={p.plate} className="h-full w-full" />
              </div>
              <div>
                <h3 className="display tilt origin-left text-[clamp(3.5rem,7vw,6rem)]">{p.name}</h3>
                <p className="display mt-5 text-2xl text-accent-ink">{copy.tagline}</p>
                <p className="mt-3 max-w-[54ch] leading-relaxed text-ink-dim">{copy.body}</p>
                <p className="mono mt-4 text-xs uppercase text-ink-dim">
                  {copy.status} · {p.stack.join(" · ")}
                </p>
                <div className="mt-6">
                  <ProjectLinks p={p} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <a href={links.github} target="_blank" rel="noreferrer" className="group mt-24 flex items-center justify-between gap-6 border-y border-line py-6 no-underline">
        <span className="display text-[clamp(2rem,4.5vw,3.5rem)] transition-colors duration-300 group-hover:text-accent-ink">{t.work.more}</span>
        <ArrowUpRight className="size-10 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
      </a>
    </section>
  );
}
