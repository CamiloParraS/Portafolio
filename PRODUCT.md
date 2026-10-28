# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters and hiring managers** screening a software engineering student for internships or a first engineering role. They skim fast: within seconds they need to know who Camilo is, what they build, and how to get the CV or reach them.
- **Remote / international companies** outside Colombia. This is why the site is bilingual: English is the default, Spanish for local readers.
- **Peers, classmates, university faculty and the dev community**, who come to look at the work itself.

## Product Purpose

The personal portfolio of Camilo Parra, a software engineering student from Pasto, Colombia, open to work. Its job is to turn a visit into an interview, a message or a CV download, and to be memorable enough that the visitor brings it up later. Success: a recruiter leaves knowing their positioning, the flagship project, their stack, and how to contact them. Camilo asked for "the most impressive portfolio there could be".

## Positioning

Systems- and games-curious engineer who goes deeper than CRUD apps while being honest about being a student who is still learning.

- **Flagship: MAGI** (https://github.com/CamiloParraS/MAGI). A local, multimodal semantic search engine for your files, written in Rust. MIT.
- **Second feature: Ghost Layer** (repo https://github.com/CamiloParraS/codename-DORO). A short third-person stealth game in Godot 4.7 / GDScript where an enemy game AI, Aigis, profiles the player's habits and adapts its forces between missions (behaviour trees, utility AI, profiling; not ML). PSone-era "modern-retro" look. Solo six-week project started 2026-10-08, live presentation around 2026-11-19. Less important than MAGI.
- **Range:** HapticWash (Kotlin wearable handwashing monitor plus a Python AI component), Sophiel (Kotlin, visual content protection), Laaf (TypeScript, institutional template manager), Java/Spring backends, TypeScript/React frontends.

## Operating Context

- Visitors arrive from CV links, LinkedIn/GitHub profiles, university contexts and direct shares; many open it on phones.
- Source of truth for projects: https://github.com/CamiloParraS (many coursework repos named `ISW-*`; some have Vercel demos).
- Required content (a checklist, not a layout order): navbar; hero with short intro, photo slot and CV download; about with a longer bio, more photos, tech stack and quick facts; projects with image, short description, GitHub link and a quick demo; testimonials; experience plus education; contact; one extra section about something outside code; footer.

## Capabilities and Constraints

- **Stack:** existing Next.js 16 (App Router) + React 19 + Tailwind CSS 4, `lucide-react` installed. `next.config.ts` sets `output: "export"` (static export), so there are no server routes. Next 16 has breaking changes: read `node_modules/next/dist/docs/` before writing code (AGENTS.md). Any component or effect library may be added.
- **Bilingual:** full EN/ES toggle covering all copy.
- **Themes:** light and dark mode.
- **Architecture:** every section is its own component.
- **Contact:** email (juanparracsfn@gmail.com), LinkedIn (https://www.linkedin.com/in/camiloparras/), GitHub, and a contact form. Because of static export, the form needs a third-party endpoint (Formspree, Web3Forms or similar); provider **undecided**.
- **Featured projects beyond MAGI and Ghost Layer:** undecided; candidates are HapticWash, Sophiel, Laaf.
- **Demos:** "quick demo" means a short recording or live link per project. No demo media exists yet.
- **Deploy target:** undecided (Vercel likely).
- **History:** an earlier full build lives on branch `static-export-deploy`. Camilo restarted from config only on branch `portfolio-v2`; the old build is not a reference to preserve.

## Brand Commitments

Binding constraints Camilo volunteered (expanded in DESIGN.md later, not here):
- ASCII art and/or dithering is the signature. Used as elements here and there; a full-page ASCII/dither background is too noisy.
- References Camilo likes: https://chanhdai.com/, https://www.nemaas.com/, and the "Agentic Fabriq" brand board (dithered/halftone tiles and checker blocks in blocks of colour on near-black, thin connecting lines, small mono labels).
- One main accent colour that is not black, white or grey.
- Voice: self-deprecating and honest ("just a boring person, ngl"). Confident about the work, never self-important.

## Evidence on Hand

- Name Camilo Parra, Pasto, Colombia, hireable. Photo: `public/img/avatar.jpg` (GitHub avatar).
- **Education:** Software Engineering, Universidad Cooperativa de Colombia, Aug 2024 to Aug 2028 (expected).
- **Experience:** freelance only. Their own projects over time (above), and hands-on IT help for family. Do not dress this up as employment.
- **Origin story:** loved videogames since childhood; got hooked on tech through emulating the Nintendo 64.
- **Outside code:** cars and videogames. Favourites: Cyberpunk 2077, Skyrim, Oblivion, Metal Gear, Forza. Car interest also shows in repos CarDynamics-Analyzer and Downforce-Analytics.
- Languages across repos: TypeScript, Rust, Kotlin, Python, Java, JavaScript, GDScript, HTML/CSS, C++ (Arduino).
- **Not yet provided:** more portrait photos, CV PDF, testimonials, project screenshots and demo recordings. Testimonials are real and will come from Camilo; until then, use clearly marked placeholder slots. Never invent names, quotes, employers, dates or metrics.

## Product Principles

1. **Proof over adjectives.** Lead with MAGI and real repos; every claim links to something verifiable.
2. **Recruiter in ten seconds, explorer in ten minutes.** Who, what, CV and contact scan instantly; depth rewards people who stay.
3. **Honest student, serious engineer.** Humility in the voice, ambition in the work. No inflated titles.
4. **Bilingual by default.** EN and ES are equal citizens, never a machine-flavoured afterthought.
5. **The site is itself a project.** Its craft demonstrates the systems and creative-coding range it claims.

## Accessibility & Inclusion

- Animated ASCII/dither effects respect `prefers-reduced-motion` and never push text contrast below WCAG AA in either theme.
- The language toggle sets `lang` on the document. Everything works by keyboard.
