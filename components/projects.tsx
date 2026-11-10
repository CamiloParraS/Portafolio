"use client";

import { ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import type { Content } from "@/lib/content";
import { GitHub } from "./brand-icons";
import { DemoPlayer } from "./demo-player";
import { ProjectArt } from "./project-art";
import { useSite } from "./providers";
import { Section } from "./section";
import { TechIcon } from "./tech-icon";

type Project = Content["work"]["projects"][number];

function Actions({ p }: { p: Project }) {
  const { t } = useSite();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost py-2.5 text-sm">
        <GitHub />
        {t.work.code}
      </a>
      {p.demo?.startsWith("http") ? (
        <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-primary py-2.5 text-sm">
          <ArrowUpRight className="size-4" />
          {t.work.demo}
        </a>
      ) : p.demo ? (
        <>
          <button type="button" onClick={() => setOpen(true)} className="btn btn-primary py-2.5 text-sm">
            <Play className="size-4 fill-current" />
            {t.work.demo}
          </button>
          {open && <DemoPlayer p={p} src={p.demo} onClose={() => setOpen(false)} />}
        </>
      ) : (
        <span className="btn btn-ghost border-dashed py-2.5 text-sm text-dim">
          <Play className="size-4" />
          {t.work.demoPending}
        </span>
      )}
    </div>
  );
}

function Art({ p }: { p: Project }) {
  const { t } = useSite();
  return (
    <>
      <div className="zoom absolute inset-0">
        <ProjectArt id={p.id} />
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-tile/85 px-2.5 py-1 text-xs text-dim backdrop-blur-sm">
        {t.work.artNote}
      </span>
    </>
  );
}

function Badges({ badges }: { badges: string[] }) {
  if (!badges.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <li key={b} className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-dim">
          {b}
        </li>
      ))}
    </ul>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="chip inline-flex items-center gap-1.5 rounded-full bg-ground px-3 py-1 text-sm text-dim">
          <TechIcon name={tag} />
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Projects() {
  const { t } = useSite();
  const [first, second, ...rest] = t.work.projects;

  return (
    <Section id="work" title={t.work.title} intro={t.work.intro}>
      <div className="grid gap-3 sm:gap-4">
        {[first, second].map((p, i) => (
          <article key={p.id} id={p.id} data-art-host className="tile grid overflow-hidden md:grid-cols-2 lg:grid-cols-5">
            <div className={`relative min-h-60 md:min-h-96 lg:col-span-3 ${i % 2 ? "md:order-2" : ""}`}>
              <Art p={p} />
            </div>
            <div className="flex flex-col p-6 sm:p-10 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{p.name}</h3>
                <Badges badges={p.badges} />
              </div>
              <p className="mt-3 text-lg font-medium">{p.tagline}</p>
              <p className="mt-3 leading-relaxed text-dim">{p.body}</p>
              <Tags tags={p.tags} />
              <div className="mt-auto">
                <Actions p={p} />
              </div>
            </div>
          </article>
        ))}

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <article key={p.id} id={p.id} data-art-host className="tile flex flex-col overflow-hidden md:max-lg:last:odd:col-span-2">
              <div className="relative h-44">
                <Art p={p} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                  <Badges badges={p.badges} />
                </div>
                <p className="mt-2 font-medium">{p.tagline}</p>
                <p className="mt-2 text-dim">{p.body}</p>
                <Tags tags={p.tags} />
                <div className="mt-auto">
                  <Actions p={p} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
