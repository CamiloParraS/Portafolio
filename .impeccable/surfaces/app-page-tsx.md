---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

## Scope

Single-page portfolio: `app/page.tsx` and one component per section under `components/`. Mode: Experience. The work (a live dithered scene, Camilo's projects) leads from the first viewport.

## Audience and job

Recruiters (internships), remote/international companies, peers. In one viewport they must know who Camilo is, see MAGI, and be able to grab the CV. Explorers continue through Work, About, Record (experience + education), Off-code (cars + games), Testimonials, Contact.

## Constraints

EN/ES toggle, light/dark themes, every section its own component, dither/ASCII as artwork in places (never a full noisy page background), one main colour (cyan). Soft corners, high legibility, no terminal-mono UI type. Testimonials, CV, extra photos and demos are placeholders the user fills in later; never invent quotes or employers.

## Direction contract

THESIS: Familiar soft-bento portfolio whose lead tile is alive: a dithered canvas scene of Galeras over Pasto with a car you can drive. Refuses the dark-neon bento of identical icon cards; tiles differ in size, material and job.
OWN-WORLD: Ink #0B0D10 / porcelain #F3F6F7 grounds, one cyan (#22D3EE fill, #0E7490 text in Day). Ordered-dither (Bayer 4x4) artwork rendered on canvas in two inks per tile; rounded 28px tiles, 14px controls, pill nav. Bricolage Grotesque display, Onest text.
STORY: Visitor meets Camilo's place (Pasto), face and flagship in one screen, believes Camilo goes deeper than CRUD because the page itself is engineered, and downloads the CV or writes.
FIRST VIEWPORT: Pill nav top. Full-width scene tile (≈55% height) with dithered avatar on its lower edge; below, intro tile (2/4 cols: name, two lines, Download CV primary, See my work), cyan MAGI tile, Ghost Layer tile.
FORM: Scene + Bento (grounded, user-chosen after rerolls; my list position 1 of the final hand). seed:a4be0ca1b03f88d6. Signature interaction: click/drag the car to drive it across the dithered scene; theme toggle turns day into night in the scene. Motion grammar: one living scene, dither images resolve to true tone on hover; everything else still.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
