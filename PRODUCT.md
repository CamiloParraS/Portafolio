# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters and hiring managers** screening a software engineering student for internships or a first engineering role. They skim fast, so they need to know who Camilo is, what they build and how to reach them or get the CV within seconds.
- **Remote / international companies** outside Colombia. This is why the site is bilingual (EN/ES): English is the default for them, Spanish for local readers.
- **Peers, classmates and university faculty** at the program in Pasto, plus the wider dev community, who come to see the work itself.

## Product Purpose

A personal portfolio for Camilo Parra, a software engineering student from Pasto, Colombia, who is open to work. Its job is to turn a visit into an interview, a message or a CV download, and to be memorable enough that the visitor brings it up later. Success means a recruiter leaves knowing their positioning, one flagship project, their stack, and how to contact them.

## Positioning

Systems- and AI-curious engineer. The lead proof is **MAGI**: a local, multimodal semantic search engine for your files, written in Rust. Other work (HapticWash's wearable motion sensing with a Python AI component, Kotlin/Android apps, Java/Spring backends, TypeScript/React frontends) backs up range. They want to be read as someone who goes deeper than CRUD apps, while honestly being a student who is still learning.

## Operating Context

- Visitors come from CV links, LinkedIn/GitHub profiles, university contexts, and direct shares; a large share open it on phones.
- Source of truth for projects: https://github.com/CamiloParraS (66 public repos, many coursework repos named `ISW-*`). Several repos have live Vercel/Netlify demos.
- Required content checklist (the user's list, not a layout order): navbar; hero with short intro, photo slot and CV download; about with a longer bio, more photos, tech stack and quick facts; projects with image, short description, GitHub link and a quick demo; testimonials; experience plus education; contact; one extra section about something outside code; footer.

## Capabilities and Constraints

- **Stack:** existing Next.js 16 (App Router) + React 19 + Tailwind CSS 4 scaffold. Next 16 has breaking changes, so read `node_modules/next/dist/docs/` before writing code (see AGENTS.md). Any component library may be added.
- **Bilingual:** full EN/ES toggle covering all copy.
- **Themes:** light and dark mode.
- **Architecture:** every section is its own component.
- **Featured projects:** MAGI is confirmed as the flagship. Which other projects to feature is still **undecided**. Candidates from GitHub: HapticWash (+AI), Sophiel, Laaf, CarDynamics-Analyzer, SensMe.
- **Demos:** "quick demo" means a short recording or live link per project. No demo media exists yet.
- **Deploy target:** undecided (Vercel likely, given existing demos).

## Brand Commitments

Binding visual constraints the user volunteered (recorded here, expanded in DESIGN.md later):
- ASCII-art and/or dithering backgrounds are the signature and main visual focus.
- References the user likes: https://chanhdai.com/ and https://www.nemaas.com/
- One main accent colour that is not black, white or grey.
- Voice: self-deprecating and honest ("a software engineering student trying to learn how to code"; self-described as "just a boring person" whose interests are cars and videogames). Confident about the work, not self-important.

## Evidence on Hand

- GitHub profile: name Camilo Parra, location Pasto, Colombia, hireable, avatar at the GitHub avatar URL.
- Languages across the repos: TypeScript, Rust, Kotlin, Python, Java, JavaScript, HTML/CSS, C++ (Arduino).
- Personal interests: cars (backed by repos such as CarDynamics-Analyzer and Downforce-Analytics) and videogames.
- **Not yet provided:** portrait photo(s), CV PDF, testimonials, work experience, education details (institution, dates), contact email/socials beyond GitHub, project screenshots and demo recordings.
- **Testimonials and experience are real and will be supplied by the user.** Until then, use clearly marked placeholder slots. Never invent names, quotes, employers, dates or metrics.

## Product Principles

1. **Proof over adjectives.** Lead with MAGI and real repos; every claim links to something verifiable.
2. **Recruiter in ten seconds, explorer in ten minutes.** The essentials (who, what, CV, contact) can be scanned instantly, and depth rewards people who stay.
3. **Honest student, serious engineer.** Keep the humility in the voice and the ambition in the work. No inflated titles.
4. **Bilingual by default.** EN and ES are equal citizens, never machine-flavoured afterthoughts.
5. **The site is itself a project.** The craft of the portfolio demonstrates the systems/creative-coding range it claims.

## Accessibility & Inclusion

- Animated ASCII/dither backgrounds must respect `prefers-reduced-motion` and never reduce text contrast below WCAG AA in either theme.
- Language toggle sets `lang` on the document. All content stays usable by keyboard.
