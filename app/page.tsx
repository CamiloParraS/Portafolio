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

export default function Home() {
  return (
    <>
      <SideDither />
      <Navbar />
      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">
        <Hero />
        <Projects />
        <About />
        <Record />
        <Testimonials />
        <OffCode />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
