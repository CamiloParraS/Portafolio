import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { OffCode } from "@/components/off-code";
import { Projects } from "@/components/projects";
import { Record } from "@/components/record";
import { SideDither } from "@/components/side-dither";
import { Testimonials } from "@/components/testimonials";

/** The one-page site; the language comes from the root layout around it. */
export function Home() {
  return (
    <>
      <div aria-hidden className="scroll-progress" />
      <SideDither />
      <Navbar />
      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">
        <Hero />
        <About />
        <Projects />
        <Testimonials />
        <Record />
        <OffCode />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
