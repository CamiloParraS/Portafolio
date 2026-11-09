import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = { languages: { en: siteUrl, es: `${siteUrl}/es` } };
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1, alternates },
    { url: `${siteUrl}/es`, changeFrequency: "monthly", priority: 1, alternates },
  ];
}
