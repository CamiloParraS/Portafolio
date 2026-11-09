import type { Metadata, Viewport } from "next";
import { content, type Lang } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const paths: Record<Lang, string> = { en: "/", es: "/es" };
const locales: Record<Lang, string> = { en: "en_US", es: "es_CO" };

/** Per-language metadata; each language has its own root layout and URL. */
export function siteMetadata(lang: Lang): Metadata {
  const { title, description } = content[lang].meta;
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: paths[lang], languages: { en: paths.en, es: paths.es, "x-default": paths.en } },
    openGraph: {
      type: "website",
      url: paths[lang],
      siteName: "Camilo Parra",
      title,
      description,
      locale: locales[lang],
      alternateLocale: [locales[lang === "en" ? "es" : "en"]],
    },
    twitter: { card: "summary_large_image", title, description },
    authors: [{ name: "Camilo Parra", url: "https://github.com/CamiloParraS" }],
  };
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090b0e" },
    { media: "(prefers-color-scheme: light)", color: "#f3f6f7" },
  ],
};
