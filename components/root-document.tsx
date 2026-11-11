import { Bricolage_Grotesque, Onest } from "next/font/google";
import { Providers } from "@/components/providers";
import type { Lang } from "@/lib/content";
import "@/app/globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });

// Runs before paint so a stored or system theme never flashes the wrong one.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

// Language switch: put the visitor back where they were before the first frame of the new page is shown,
// so the cross-document view transition fades between two pages at the same scroll position.
const restoreScript = `addEventListener("pagereveal",function(){try{var r=sessionStorage.getItem("lang-scroll");if(!r)return;sessionStorage.removeItem("lang-scroll");var a=JSON.parse(r),e=document.getElementById(a.id);if(e)scrollTo({top:e.getBoundingClientRect().top+scrollY+a.offset,behavior:"instant"})}catch(e){}})`;

type Props = { lang: Lang; headScript?: string; children: React.ReactNode };

/** The `<html>` shell shared by the per-language root layouts. */
export function RootDocument({ lang, headScript, children }: Props) {
  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning className={`${bricolage.variable} ${onest.variable}`}>
      <head>
        {headScript && <script dangerouslySetInnerHTML={{ __html: headScript }} />}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: restoreScript }} />
        <link rel="prefetch" href={lang === "en" ? "/es" : "/"} />
      </head>
      <body>
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
