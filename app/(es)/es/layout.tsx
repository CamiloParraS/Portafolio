import { RootDocument } from "@/components/root-document";
import { siteMetadata, siteViewport } from "@/lib/metadata";

export const metadata = siteMetadata("es");
export const viewport = siteViewport;

export default function SpanishLayout({ children }: LayoutProps<"/es">) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
