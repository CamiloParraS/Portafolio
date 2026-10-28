import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Onest } from "next/font/google";
import { Providers } from "@/components/providers";
import { content } from "@/lib/content";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });

export const metadata: Metadata = {
  title: content.en.meta.title,
  description: content.en.meta.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
    { media: "(prefers-color-scheme: light)", color: "#f3f6f7" },
  ],
};

// Runs before paint so a stored or system theme never flashes the wrong one.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${bricolage.variable} ${onest.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
