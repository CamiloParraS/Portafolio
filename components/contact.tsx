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

type Status = "idle" | "sending" | "sent" | "error" | "invalid" | "mailApp";
type Field = "name" | "email" | "message";

// Limits are enforced twice: `maxLength` on the inputs and `clean()` on submit (the DOM is not a security boundary).
const MAX = { name: 80, email: 254, message: 2000 } as const;
// Pragmatic, not RFC-perfect: one @, no spaces, a dot in the domain. The mail provider does the real check.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normalises one field before it is validated or sent: Unicode NFC, control and zero-width characters
 * removed (this also blocks header injection through the subject), then trimmed and capped.
 * Single-line fields collapse all whitespace; the message keeps line breaks but not runs of blank lines.
 */
function clean(value: FormDataEntryValue | null, max: number, multiline = false) {
  let v = String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n");
  v = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠﻿]/g, "");
  v = multiline ? v.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n") : v.replace(/\s+/g, " ");
  return v.trim().slice(0, max);
}

export function Contact() {
  const { t } = useSite();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [bad, setBad] = useState<Partial<Record<Field, boolean>>>({});

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    // A filled honeypot means a bot: pretend it worked and send nothing.
    if (data.get("botcheck")) return setStatus("sent");
    const name = clean(data.get("name"), MAX.name);
    const email = clean(data.get("email"), MAX.email).toLowerCase();
    const message = clean(data.get("message"), MAX.message, true);

    const invalid: Partial<Record<Field, boolean>> = {};
    if (!name) invalid.name = true;
    if (!EMAIL.test(email)) invalid.email = true;
    if (!message) invalid.message = true;
    setBad(invalid);
    const firstBad = (["name", "email", "message"] as const).find((f) => invalid[f]);
    if (firstBad) {
      setStatus("invalid");
      (form.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
      return;
    }

    if (!FORM_KEY) {
      const body = encodeURIComponent(`${message}\n\n${name} <${email}>`);
      window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(`Portfolio: ${name}`)}&body=${body}`;
      // The page cannot tell whether a mail app opened (desktop browsers often have none), so say what to do if not.
      setStatus("mailApp");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolio: ${name}`,
          from_name: "Portfolio",
          name,
          email,
          message,
          botcheck: "",
        }),
      });
      // Web3Forms answers { success: false } for a bad key or a blocked submission, so the body decides.
      const json: { success?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || json.success !== true) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field =
    "mt-2 w-full rounded-2xl border border-line bg-ground px-4 py-3 text-base font-normal text-ink placeholder:text-dim transition-colors duration-150 focus:border-accent-ink focus:outline-none aria-invalid:border-rose-500";

  const enter = "inline-block transition-[opacity,translate] duration-200 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0";

  return (
    <Section id="contact" title={c.title} intro={c.intro}>
      <div className="tile grid gap-10 p-6 sm:p-10 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <a href={`mailto:${links.email}`} className="link font-display text-2xl font-bold tracking-tight break-all sm:text-4xl">
            {links.email}
          </a>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className="btn btn-ghost py-2.5 text-sm">
              {copied ? <Check className="size-4 text-accent-ink transition-[opacity,scale] duration-200 ease-out starting:scale-75 starting:opacity-0" /> : <Copy className="size-4" />}
              {/* Both labels share one grid cell, so the button keeps the wider width and never shifts its neighbours. */}
              <span className="grid">
                <span aria-hidden={copied} className={`col-start-1 row-start-1 transition-[opacity,filter] duration-200 motion-reduce:transition-none ${copied ? "opacity-0 blur-[2px]" : ""}`}>
                  {c.copy}
                </span>
                <span aria-hidden={!copied} className={`col-start-1 row-start-1 transition-[opacity,filter] duration-200 motion-reduce:transition-none ${copied ? "" : "opacity-0 blur-[2px]"}`}>
                  {c.copied}
                </span>
              </span>
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
          {/* Honeypot: people never see it, bots fill it, Web3Forms drops those submissions. */}
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <label className="block text-sm font-medium">
            {c.name}
            <input name="name" maxLength={MAX.name} aria-invalid={bad.name || undefined} onChange={() => bad.name && setBad((b) => ({ ...b, name: false }))} autoComplete="name" placeholder={c.namePh} className={field} />
          </label>
          <label className="block text-sm font-medium">
            {c.email}
            <input name="email" maxLength={MAX.email} aria-invalid={bad.email || undefined} onChange={() => bad.email && setBad((b) => ({ ...b, email: false }))} type="email" autoComplete="email" placeholder={c.emailPh} className={field} />
          </label>
          <label className="block text-sm font-medium">
            {c.message}
            <textarea name="message" maxLength={MAX.message} aria-invalid={bad.message || undefined} onChange={() => bad.message && setBad((b) => ({ ...b, message: false }))} rows={4} placeholder={c.messagePh} className={`${field} resize-y`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === "sending"} className="btn btn-primary">
              {FORM_KEY ? <Send className="size-[18px]" /> : <Mail className="size-[18px]" />}
              {status === "sending" ? c.sending : c.send}
            </button>
            <p role="status" aria-live="polite" className="text-sm">
              {status === "sent" && <span className={`text-accent-ink ${enter}`}>{c.sent}</span>}
              {status === "invalid" && <span className={`text-dim ${enter}`}>{c.invalid}</span>}
              {(status === "error" || status === "mailApp") && (
                <span className={`text-dim ${enter}`}>
                  {status === "error" ? c.error : c.mailApp}{" "}
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
