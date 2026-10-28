import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Figtree, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { content } from "@/lib/content";
import "./globals.css";

// Display: the pause-menu voice. Body: an open, rounded sans for long reading.
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: "800",
  style: "italic",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: content.en.meta.title,
  description: content.en.meta.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#161d2c" },
    { media: "(prefers-color-scheme: light)", color: "#e6f0ff" },
  ],
};

// Runs before paint so a stored or system theme never flashes the wrong one.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="day"&&t!=="night")t=matchMedia("(prefers-color-scheme: light)").matches?"day":"night";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="night" suppressHydrationWarning className={`${barlow.variable} ${figtree.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
