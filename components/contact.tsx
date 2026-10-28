"use client";

import { Check, Copy, Mail, Send } from "lucide-react";
import { useState } from "react";
import { links } from "@/lib/content";
import { GitHub, LinkedIn } from "./brand-icons";
import { useSite } from "./providers";
import { Section } from "./section";

// Static export has no server, so the form posts to Web3Forms when a key is configured
// (NEXT_PUBLIC_WEB3FORMS_KEY) and falls back to the visitor's mail app otherwise.
const FORM_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error" | "invalid";

export function Contact() {
  const { t } = useSite();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) return setStatus("invalid");

    if (!FORM_KEY) {
      const body = encodeURIComponent(`${message}\n\n${name} <${email}>`);
      window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(`Portfolio: ${name}`)}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: FORM_KEY, subject: `Portfolio: ${name}`, name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field =
    "mt-2 w-full rounded-2xl border border-line bg-ground px-4 py-3 text-ink placeholder:text-dim/80 transition-colors focus:border-accent-ink focus:outline-none";

  return (
    <Section id="contact" title={c.title} intro={c.intro}>
      <div className="tile grid gap-10 p-6 sm:p-10 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <a href={`mailto:${links.email}`} className="link font-display text-2xl font-bold tracking-tight break-all sm:text-4xl">
            {links.email}
          </a>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className="btn btn-ghost py-2.5 text-sm" aria-live="polite">
              {copied ? <Check className="size-4 text-accent-ink" /> : <Copy className="size-4" />}
              {copied ? c.copied : c.copy}
            </button>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost py-2.5 text-sm">
              <LinkedIn />
              LinkedIn
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="btn btn-ghost py-2.5 text-sm">
              <GitHub />
              GitHub
            </a>
          </div>
          <p className="mt-6 text-dim">{c.where}</p>
        </div>

        <form onSubmit={submit} noValidate className="grid gap-4">
          <label className="block text-sm font-medium">
            {c.name}
            <input name="name" autoComplete="name" placeholder={c.namePh} className={field} />
          </label>
          <label className="block text-sm font-medium">
            {c.email}
            <input name="email" type="email" autoComplete="email" placeholder={c.emailPh} className={field} />
          </label>
          <label className="block text-sm font-medium">
            {c.message}
            <textarea name="message" rows={4} placeholder={c.messagePh} className={`${field} resize-y`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === "sending"} className="btn btn-primary">
              {FORM_KEY ? <Send className="size-[18px]" /> : <Mail className="size-[18px]" />}
              {status === "sending" ? c.sending : c.send}
            </button>
            <p role="status" className="text-sm">
              {status === "sent" && <span className="text-accent-ink">{c.sent}</span>}
              {status === "invalid" && <span className="text-dim">{c.invalid}</span>}
              {status === "error" && (
                <span className="text-dim">
                  {c.error}{" "}
                  <a href={`mailto:${links.email}`} className="link text-ink">
                    {links.email}
                  </a>
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </Section>
  );
}
