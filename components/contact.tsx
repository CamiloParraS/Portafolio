"use client";

import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { links } from "@/lib/content";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { useSite } from "./providers";
import { SectionHead } from "./section-head";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function Contact() {
  const { t } = useSite();
  const c = t.contact;
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const enabled = Boolean(links.email);

  // No backend: the form composes a mail in the visitor's own client.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = c.errName;
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = c.errEmail;
    if (!message) next.message = c.errMessage;
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
    location.href = `mailto:${links.email}?subject=${encodeURIComponent(`Portfolio · ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} <${email}>`)}`;
  };

  const field = "w-full border-0 border-b-2 border-line bg-transparent px-0 py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-dim focus:border-accent aria-[invalid=true]:border-accent";
  const err = (k: keyof Errors) =>
    errors[k] && (
      <p id={`${k}-err`} className="mono mt-2 text-xs uppercase text-accent-ink">
        {errors[k]}
      </p>
    );

  const elsewhere = [
    { href: links.github, label: "GitHub", Icon: GithubIcon },
    { href: links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: links.email && `mailto:${links.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mx-auto max-w-[90rem] px-(--gutter) py-28 md:py-40">
      <SectionHead id="contact" hour="00:59" title={c.title}>
        <p className="text-xl text-ink">{c.intro}</p>
      </SectionHead>

      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        {enabled ? (
        <form noValidate onSubmit={submit} className="space-y-8 bg-ground/85 p-6 md:p-10">
          {(["name", "email"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={k} className="mono text-xs uppercase text-ink-dim">
                {c[k]}
              </label>
              <input
                id={k}
                name={k}
                type={k === "email" ? "email" : "text"}
                autoComplete={k}
                disabled={!enabled}
                aria-invalid={Boolean(errors[k])}
                aria-describedby={errors[k] ? `${k}-err` : undefined}
                className={field}
              />
              {err(k)}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="mono text-xs uppercase text-ink-dim">
              {c.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              disabled={!enabled}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-err" : undefined}
              className={`${field} resize-y`}
            />
            {err("message")}
          </div>
          <button
            type="submit"
            className="blade inline-flex items-center gap-3 bg-accent py-3 pl-7 pr-9 text-on-accent transition-colors duration-300 hover:bg-ink hover:text-ground"
          >
            <Send className="size-5" />
            <span className="display text-3xl">{sent ? c.sending : c.send}</span>
          </button>
        </form>
        ) : (
          <div className="self-start bg-ground/85 p-6 md:p-10">
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="blade group inline-flex items-center gap-4 bg-accent py-4 pl-8 pr-10 text-on-accent no-underline transition-colors duration-300 hover:bg-ink hover:text-ground"
            >
              <GithubIcon className="size-7" />
              <span className="display text-[clamp(2rem,4vw,3rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{c.githubCta}</span>
            </a>
            <p className="mt-6 max-w-[48ch] text-ink-dim">{c.emailPending}</p>
          </div>
        )}

        <div>
          <h3 className="display text-4xl">{c.elsewhere}</h3>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {elsewhere.map(({ href, label, Icon }) => (
              <li key={label}>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-5 no-underline">
                    <Icon className="size-6 text-accent-ink" />
                    <span className="display text-3xl transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{label}</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-4 py-5 text-ink-dim">
                    <Icon className="size-6" />
                    <span className="display pending text-3xl">{label}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
