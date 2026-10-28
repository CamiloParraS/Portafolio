"use client";

import { ArrowUp } from "lucide-react";
import { links } from "@/lib/content";
import { GitHub, LinkedIn } from "./brand-icons";
import { useSite } from "./providers";

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="mt-24 border-t border-line py-10 sm:mt-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">Camilo Parra</p>
          <p className="text-sm text-dim">
            © 2026 · Pasto, Colombia · {t.footer.built}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-10 place-items-center rounded-xl hover:bg-tile">
            <GitHub className="size-5" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-xl hover:bg-tile">
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
