import { RootDocument } from "@/components/root-document";
import { siteMetadata, siteViewport } from "@/lib/metadata";

export const metadata = siteMetadata("en");
export const viewport = siteViewport;

// Static hosting has no Accept-Language step, so `/` sends Spanish readers to `/es` before anything paints.
const languageScript = `var l;try{l=localStorage.getItem("lang")}catch(e){}if(l!=="en"&&l!=="es")l=navigator.language.startsWith("es")?"es":"en";if(l==="es"){document.documentElement.style.visibility="hidden";location.replace("/es"+location.search+location.hash)}`;

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return (
    <RootDocument lang="en" headScript={languageScript}>
      {children}
    </RootDocument>
  );
}
