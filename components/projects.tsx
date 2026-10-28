"use client";

import { Play } from "lucide-react";
import type { Content } from "@/lib/content";
import { GitHub } from "./brand-icons";
import { ProjectArt } from "./project-art";
import { useSite } from "./providers";
import { Section } from "./section";

type Project = Content["work"]["projects"][number];

function Actions({ p }: { p: Project }) {
  const { t } = useSite();
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost py-2.5 text-sm">
        <GitHub />
        {t.work.code}
      </a>
      {p.demo ? (
        <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-primary py-2.5 text-sm">
          <Play className="size-4" />
          {t.work.demo}
        </a>
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
      <ProjectArt id={p.id} />
      <span className="absolute bottom-3 left-3 rounded-full bg-tile/85 px-2.5 py-1 text-xs text-dim backdrop-blur-sm">
        {t.work.artNote}
      </span>
    </>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-ground px-3 py-1 text-sm text-dim">
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
          <article key={p.id} id={p.id} className="tile grid overflow-hidden md:grid-cols-5">
            <div className={`relative min-h-60 md:col-span-3 md:min-h-96 ${i % 2 ? "md:order-2" : ""}`}>
              <Art p={p} />
            </div>
            <div className="flex flex-col p-6 sm:p-10 md:col-span-2">
              <h3 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{p.name}</h3>
              <p className="mt-3 text-lg font-medium">{p.tagline}</p>
              <p className="mt-3 leading-relaxed text-dim">{p.body}</p>
              <Tags tags={p.tags} />
              <div className="mt-auto">
                <Actions p={p} />
              </div>
            </div>
          </article>
        ))}

        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {rest.map((p) => (
            <article key={p.id} id={p.id} className="tile flex flex-col overflow-hidden">
              <div className="relative h-44">
                <Art p={p} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
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
