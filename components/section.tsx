type Props = { id: string; title: string; intro?: string; children: React.ReactNode };

/** Shared section frame: one heading voice and one rhythm for every section. */
export function Section({ id, title, intro, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pt-24 sm:pt-32">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <h2 id={`${id}-title`} className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
          {title}
        </h2>
        {intro && <p className="max-w-md text-base text-dim sm:text-right">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
