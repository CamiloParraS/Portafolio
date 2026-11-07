// Set NEXT_PUBLIC_SITE_URL to override the deployed origin. Share cards, the sitemap and
// canonical links need an absolute URL, so a missing scheme is added.
const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "camiloparra.pages.dev";
export const siteUrl = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
