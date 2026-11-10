"use client";

import { ArrowUp } from "lucide-react";
import { links } from "@/lib/content";
import { GitHub, LinkedIn } from "./brand-icons";
import { useSite } from "./providers";
import { Scene } from "./scene";

// Same order as the page; each id is a section anchor.
const sections = ["about", "work", "testimonials", "record", "offcode", "contact"] as const;

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="mt-24 sm:mt-32">
      <div className="mx-auto flex max-w-6xl px-4 sm:px-6 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">Camilo Parra</p>
          <p className="text-sm text-dim">
            © 2026 · {t.footer.built}
          </p>
          <nav aria-label={t.footer.quick} className="mt-1.5 flex flex-wrap gap-x-4 text-sm text-dim">
            {sections.map((id) => (
              <a key={id} href={`#${id}`} className="py-2.5 transition-colors hover:text-ink">
                {t.nav[id]}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-10 place-items-center rounded-xl transition-colors hover:bg-tile">
            <GitHub className="size-5" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-xl transition-colors hover:bg-tile">
            <LinkedIn className="size-5" />
          </a>
          <a href="#top" className="btn btn-ghost ml-2 py-2.5 text-sm">
            <ArrowUp className="size-4" />
            {t.footer.top}
          </a>
        </div>
      </div>
      {/* Galeras over Pasto, drivable: the page's sign-off. The sky fades up into the row above. */}
      <div className="relative h-[clamp(240px,38vh,400px)] overflow-hidden [&_canvas]:[mask-image:linear-gradient(to_bottom,transparent,black_45%)]">
        <Scene />
      </div>
    </footer>
  );
}
