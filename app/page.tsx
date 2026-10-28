import { AfterHours } from "@/components/after-hours";
import { Bonds } from "@/components/bonds";
import { Contact } from "@/components/contact";
import { DitherSea } from "@/components/dither-sea";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar, SkipLink } from "@/components/navbar";
import { Record } from "@/components/record";
import { Status } from "@/components/status";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <SkipLink />
      <DitherSea />
      <Navbar />
      <main>
        <Hero />
        <Status />
        <Work />
        <Bonds />
        <Record />
        <AfterHours />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
