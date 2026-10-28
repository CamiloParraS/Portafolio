"use client";

import { FileText, Image as ImageIcon, Search, Sheet, FileCode } from "lucide-react";
import { useState } from "react";
import { useSite } from "./providers";

// Illustrative only: invented files and scores that show how meaning-based ranking reads.
const results = [
  [
    { file: "IMG_2291.jpg", where: "Photos/2026", kind: "img", hit: "OCR · “Taller · Total $380.000”", score: 0.91 },
    { file: "scan_0042.pdf", where: "Downloads", kind: "doc", hit: "Invoice · brake pads, labour", score: 0.87 },
    { file: "gastos-marzo.xlsx", where: "Documents", kind: "sheet", hit: "Row 14 · car service", score: 0.74 },
    { file: "car-maintenance.md", where: "Notes", kind: "code", hit: "Next oil change at 45,000 km", score: 0.69 },
  ],
  [
    { file: "PXL_20260914_1530.jpg", where: "Camera", kind: "img", hit: "Visual match · boxes and arrows", score: 0.93 },
    { file: "clase-patrones.png", where: "University", kind: "img", hit: "Visual match · UML diagram", score: 0.88 },
    { file: "state-pattern.pdf", where: "University", kind: "doc", hit: "Figure 3 · state transitions", score: 0.71 },
    { file: "final-uml.drawio.png", where: "Projects", kind: "img", hit: "Visual match · class diagram", score: 0.66 },
  ],
  [
    { file: "estructuras-semana7.md", where: "University", kind: "code", hit: "Doubly circular linked lists", score: 0.92 },
    { file: "dcll.py", where: "repos/ISW-4A26A", kind: "code", hit: "class Node: prev, next", score: 0.86 },
    { file: "test_linked_list.py", where: "repos/ISW-4A26A", kind: "code", hit: "def test_insert_after", score: 0.8 },
    { file: "parcial-2-resumen.pdf", where: "University", kind: "doc", hit: "Page 2 · pointers and nodes", score: 0.72 },
  ],
];

const icons = { img: ImageIcon, doc: FileText, sheet: Sheet, code: FileCode };

export function MagiDemo() {
  const { t } = useSite();
  const [q, setQ] = useState(0);

  return (
    <div className="bg-ground p-5 text-ink md:p-7">
      <p className="display text-3xl">{t.work.demoTitle}</p>
      <p className="mt-2 max-w-[48ch] text-sm text-ink-dim">{t.work.demoHint}</p>

      <div role="group" aria-label={t.work.demoTitle} className="mt-5 flex flex-wrap gap-2">
        {t.work.queries.map((query, i) => (
          <button
            key={query}
            type="button"
            aria-pressed={q === i}
            aria-controls="magi-results"
            onClick={() => setQ(i)}
            className={`blade px-4 py-1.5 text-left text-sm font-semibold transition-colors duration-300 ${
              q === i ? "bg-accent text-on-accent" : "bg-deep text-ink hover:bg-line"
            }`}
          >
            {query}
          </button>
        ))}
      </div>

      <div className="mono mt-5 flex items-center gap-3 border-b border-line pb-3 text-sm">
        <Search className="size-4 text-accent-ink" aria-hidden />
        <span>{t.work.queries[q]}</span>
        <span className="ml-auto h-4 w-2 animate-pulse bg-accent" aria-hidden />
      </div>

      <ol id="magi-results" aria-live="polite" key={q} className="divide-y divide-line">
        {results[q].map((r, i) => {
          const Icon = icons[r.kind as keyof typeof icons];
          return (
            <li
              key={r.file}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-3 motion-safe:animate-[rise_0.6s_var(--ease-out-expo)_both]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Icon className="size-5 text-accent-ink" aria-hidden />
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.file}</p>
                <p className="mono text-xs text-ink-dim">
                  {r.where} · {r.hit}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden h-1.5 w-20 bg-deep sm:block">
                  <span className="block h-full bg-accent" style={{ width: `${r.score * 100}%` }} />
                </span>
                <span className="mono text-sm tabular-nums">{r.score.toFixed(2)}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mono mt-4 text-xs uppercase text-ink-dim">{t.work.demoNote}</p>
    </div>
  );
}
