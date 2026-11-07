"use client";

import { ArrowUp } from "lucide-react";
import { links } from "@/lib/content";
import { GitHub, LinkedIn } from "./brand-icons";
import { useSite } from "./providers";
import { Scene } from "./scene";

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="mt-24 pb-10 sm:mt-32">
      {/* Galeras over Pasto, drivable: the page's sign-off. */}
      <div className="tile relative h-[clamp(220px,34vh,340px)] overflow-hidden">
        <Scene />
      </div>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">Camilo Parra</p>
          <p className="text-sm text-dim">
            © 2026 · {t.footer.built}
          </p>
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
    </footer>
  );
}
