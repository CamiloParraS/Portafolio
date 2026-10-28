---
name: Camilo Parra Portfolio
description: A soft-bento portfolio whose lead tile is a living dithered scene of Galeras over Pasto.
colors:
  night-ground: "#0b0d10"
  night-tile: "#121519"
  night-ink: "#f1f4f6"
  night-dim: "#a7b1b9"
  night-line: "#252a30"
  day-ground: "#f3f6f7"
  day-tile: "#ffffff"
  day-ink: "#0b0d10"
  day-dim: "#48535d"
  day-line: "#d6dee3"
  galeras-cyan: "#22d3ee"
  deep-cyan: "#0e7490"
  on-cyan: "#05141a"
  night-dither-mid: "#164e5c"
  day-dither-mid: "#9fe3f0"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3rem, 3rem + 2vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 2.25rem + 2vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  focus: "10px"
  icon: "12px"
  control: "14px"
  field: "16px"
  tile: "28px"
  pill: "9999px"
spacing:
  gap-sm: "12px"
  gap: "16px"
  tile-pad-sm: "24px"
  tile-pad: "32px"
  tile-pad-lg: "40px"
  section-sm: "96px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.galeras-cyan}"
    textColor: "{colors.on-cyan}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
  tile:
    backgroundColor: "{colors.night-tile}"
    rounded: "{rounded.tile}"
  tile-accent:
    backgroundColor: "{colors.galeras-cyan}"
    textColor: "{colors.on-cyan}"
    rounded: "{rounded.tile}"
  input-field:
    backgroundColor: "{colors.night-ground}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  chip-tag:
    backgroundColor: "{colors.night-ground}"
    textColor: "{colors.night-dim}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  nav-pill:
    backgroundColor: "{colors.night-tile}"
    rounded: "{rounded.pill}"
    height: "56px"
---

# Design System: Camilo Parra Portfolio

## Overview

**Creative North Star: "The Lit Bento"**

A familiar, soft-cornered bento grid on a near-black (Night) or porcelain (Day) ground, where the tiles are not interchangeable cards: they differ in size, material and job. The lead tile is alive, a canvas scene of Galeras over Pasto printed in ordered dither, with a car the visitor can drive. Everything else is still. The page earns its "engineered" claim through the artwork engine, not through terminal styling.

Artwork is printed, not illustrated: every image surface (the scene, project art, the avatar) is rendered on canvas in the theme's own three-step cyan ink ramp, so one theme switch repaints all art at once. Photos resolve to true tone on hover, focus or tap. Dither lives inside tiles only; text and UI stay clean, high-legibility sans.

Density is relaxed: generous tile padding, one section rhythm, one accent. Type is a warm grotesque display (Bricolage) over a calm geometric text face (Onest).

**Key Characteristics:**
- Two grounds (Night and Day), one cyan.
- 28px tiles, 14px controls, pill navigation and chips.
- Canvas artwork in three dither inks per theme; pixelated rendering, 3 CSS px per cell.
- One living scene; hover develops photos; everything else holds still.
- Flat tiles separated by a 1px hairline, not shadows.

## Colors

A near-monochrome pair of grounds carrying a single saturated cyan, with the cyan's own deep and pale tints reserved for dither ink.

### Primary
- **Galeras Cyan** (galeras-cyan): The one accent. Fills the primary button, the MAGI accent tile, the logo mark, the availability dot, text selection, and the brightest dither ink in Night. Identical in both themes as a fill.
- **Deep Cyan** (deep-cyan): Cyan used as text and focus ring in Day (in Night, accent text uses Galeras Cyan itself). Also the high dither ink in Day and the mid ink on the accent tile.
- **On-Cyan** (on-cyan): Text and icons placed on a cyan fill; darkest ink on the accent tile and in Day photos.

### Neutral
- **Night Ground / Day Ground** (night-ground / day-ground): Page background; also the inset fill for inputs, tags, and icon-button hover.
- **Night Tile / Day Tile** (night-tile / day-tile): Tile surface; also the dither ground ink so art sits flush in its tile.
- **Night Ink / Day Ink** (night-ink / day-ink): Primary text.
- **Night Dim / Day Dim** (night-dim / day-dim): Secondary text, metadata, ghost-button hover border.
- **Night Line / Day Line** (night-line / day-line): Tile borders, dividers, ghost-button border, scrollbar.
- **Night / Day Dither Mid** (night-dither-mid / day-dither-mid): Middle dither ink only; never used for UI or text.

### Named Rules
**The One Cyan Rule.** Cyan is the only hue. Any second colour on a surface must be a tint of cyan or a neutral; dither ramps are built from the cyan family per theme.

**The Ink Follows The Theme Rule.** Art never hardcodes colour. Canvases read `--dither-ground`, `--dither-mid`, `--dither-hi` from their element, so the accent tile (`.on-accent`) and Day photos (`.photo-inks`) override inks locally rather than drawing in new colours.

## Typography

**Display Font:** Bricolage Grotesque (with system-ui, sans-serif)
**Body Font:** Onest (with system-ui, sans-serif)

**Character:** A slightly quirky, high-contrast grotesque for names and headings, set tight and bold; a plain, open geometric sans for reading. No monospace anywhere in the UI.

### Hierarchy
- **Display** (700, 48px to 72px, line-height 1, -0.04em): The name in the intro tile only.
- **Headline** (700, 36px to 60px, line-height 1, -0.03em): Section titles; flagship project names (40px to 48px).
- **Title** (700, 24px to 30px, -0.025em): Tile headings, secondary project names, the games list (600).
- **Body** (400, 16px to 18px, line-height 1.625): Paragraphs in dim; lead paragraphs in ink at 20px to 24px. Measure capped at 48 to 62ch.
- **Label** (500 to 600, 14px; 12px for art captions): Form labels, tags, metadata, buttons in dense rows. Sentence case, no tracking.

### Named Rules
**The Display Is Bricolage Rule.** Every h1 to h3 and the wordmark use Bricolage Grotesque, bold and negatively tracked; body and controls use Onest. Headings balance their wrap.

**The Tabular Facts Rule.** Dates and numeric facts use tabular numerals.

## Layout

A single centered column capped at 1152px with 16px side padding (24px from 640px). Each section opens with a shared frame: a large headline, with an optional short intro that sits right-aligned on the same baseline row from 640px and stacks below it on mobile. Sections are spaced 96px apart (128px from 640px). Inside, tiles sit on a bento grid with 12px gaps (16px from 640px): 4 columns in the hero, 6 in About and Off-code, 5 in flagship project rows (art 3, text 2, alternating sides), 3 for secondary projects and testimonials. All grids collapse to one column below 768px.

Tile padding is 24px on mobile and 32px to 40px from 640px. The hero scene tile is full width at `clamp(240px, 44vh, 460px)`; the avatar overlaps the top edge of the intro tile below it. The nav is sticky, 12 to 16px from the top, and scroll padding clears it by 6rem.

## Elevation & Depth

Flat by default. Tiles separate from the ground through a 1px line border and a tonal step (tile vs ground), never a shadow. Only two elements float, and both use soft, diffuse, negative-spread shadows: the sticky nav pill (with an 85% tile fill and backdrop blur) and the avatar lifted over the scene edge. Small overlays on art (captions, the scene control) use the same 85% tile fill with blur and no shadow.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.35)`): The sticky nav pill only.
- **Lift** (`box-shadow: 0 12px 30px -14px rgb(0 0 0 / 0.5)`): The avatar overlapping the scene edge.

### Named Rules
**The Hairline Not Shadow Rule.** A tile is a tile because of its border and surface tone. If a new tile needs a shadow to read, the tone step is wrong.

## Shapes

Soft, nested corners that shrink with scale: tiles 28px, the avatar 26px (with a 4px tile-coloured border so it reads as cut out of the tile), fields 16px, buttons 14px, icon buttons and menu items 12px to 16px, the focus ring 10px. Navigation, tags, chips and art captions are full pills. Placeholders (empty testimonials, pending CV and demo buttons, photo slots) use a dashed line border in the same radius as the real element, so a slot visibly awaits content. The 2x2 rounded-square cyan mark is the only logo shape.

## Components

### Buttons
One shape, two weights.
- **Shape:** gently rounded (14px), 0.5rem icon gap, 600 weight, line-height 1.
- **Primary:** Galeras Cyan fill, On-Cyan text, `0.8rem 1.25rem` padding; dense rows shrink vertical padding to 0.625rem at 14px.
- **Ghost:** transparent with a 1px line border and ink text.
- **Hover / Focus:** primary mixes 15% ink into the cyan; ghost border shifts to dim. Press scales to 0.97 over 0.2s with an expo-out curve. Focus is a 2px accent-text outline, 3px offset.
- **Pending:** a ghost button with a dashed border and dim text stands in for an unconfigured CV or demo; disabled drops to 55% opacity.

### Chips
- **Tag:** ground fill, dim text, pill, `4px 12px`, 14px (project tags).
- **Stack chip:** transparent with line border, ink text, 500 weight (About stack list).

### Cards / Containers
- **Corner Style:** 28px.
- **Background:** tile surface; the single accent tile (MAGI) takes a Galeras Cyan fill with On-Cyan text and re-inked art.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px line; linked tiles shift the border to dim on hover.
- **Internal Padding:** 24px to 40px; art tiles bleed to the edge with text padded below or beside.

### Inputs / Fields
- **Style:** ground fill inside a tile, 1px line border, 16px radius, `12px 16px` padding, dim placeholder; label above in 14px 500.
- **Focus:** border shifts to accent text colour; no glow.
- **Error:** status messages in dim; success in accent text.

### Navigation
- **Style:** sticky 56px pill, 85% tile fill, backdrop blur, Float shadow. Wordmark in Bricolage bold, lowercase. Links 14px dim, 12px-radius hover pill on ground fill turning ink. Language and theme toggles are 40px icon buttons.
- **Mobile:** links collapse into a menu button; the menu opens as a tile under the pill with 18px items. Escape closes it.

### Dither Canvas (signature)
Canvas art drawn at 3 CSS px per cell and scaled up with pixelated rendering. Generated art and the scene use 4x4 Bayer ordered dither across three inks so animation never shimmers; photos use three-level Atkinson diffusion with contrast stretch, lit in cyan in Night and inverted to ink the shadows in Day. Only the scene animates, and it freezes on its first frame under reduced motion. Photos fade to the real image over 500ms on hover, focus or tap.

## Do's and Don'ts

### Do:
- **Do** build every new surface as a 28px tile with a 1px line border on the tile tone, placed in the 12px/16px bento grid.
- **Do** render new artwork through the shared dither engine, reading inks from the three `--dither-*` properties so both themes repaint it.
- **Do** keep cyan as the only hue; use Deep Cyan for cyan text on Day.
- **Do** use the shared section frame (headline plus optional right-aligned intro) for every new section.
- **Do** mark unfilled content (quotes, CV, demos, photos) with dashed-border placeholders instead of invented content.
- **Do** keep motion to the scene, photo develop on hover, and 0.2s control feedback; respect reduced motion.

### Don't:
- **Don't** use dither as a full-page or behind-text background; it lives inside tiles as artwork.
- **Don't** use monospace or terminal styling for UI type.
- **Don't** add a second accent hue or a gradient.
- **Don't** add shadows to tiles; only the nav pill and the overlapping avatar float.
- **Don't** make a row of identical icon cards; tiles differ in size, material and job.
