---
name: Camilo Parra — The Dark Hour
description: A one-page portfolio set in the hidden hour after midnight; a dithered moonlit sea behind a slanted pause menu.
colors:
  midnight-ground: "#161d2c"
  midnight-deep: "#27324d"
  midnight-ink: "#cdd5e3"
  midnight-ink-dim: "#93a0ba"
  midnight-line: "#33405e"
  midnight-cyan: "#74bfe3"
  dark-hour-cyan: "#3ec6ff"
  day-ground: "#e6f0ff"
  day-deep: "#b7cff7"
  day-ink: "#06103a"
  day-ink-dim: "#2b3f78"
  day-line: "#9fbcec"
  day-cyan-ink: "#0063a6"
typography:
  display:
    fontFamily: "Barlow Condensed, Figtree, sans-serif"
    fontSize: "clamp(5rem, 13vw, 11rem)"
    fontWeight: 800
    lineHeight: 0.86
  headline:
    fontFamily: "Barlow Condensed, Figtree, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.86
  title:
    fontFamily: "Barlow Condensed, Figtree, sans-serif"
    fontSize: "clamp(2rem, 3.3vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.86
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.02em"
    fontFeature: "'tnum'"
rounded:
  none: "0"
spacing:
  gutter: "clamp(1.5rem, 6vw, 6rem)"
  section-mobile: "112px"
  section-desktop: "160px"
  container: "90rem"
components:
  blade-selected:
    backgroundColor: "{colors.midnight-cyan}"
    textColor: "{colors.midnight-ground}"
    rounded: "{rounded.none}"
    padding: "0.2em 0.7em"
  button-save-data:
    backgroundColor: "{colors.midnight-ink}"
    textColor: "{colors.midnight-ground}"
    rounded: "{rounded.none}"
    padding: "12px 36px 12px 28px"
  button-save-data-hover:
    backgroundColor: "{colors.dark-hour-cyan}"
    textColor: "{colors.midnight-ground}"
  button-source:
    backgroundColor: "{colors.midnight-ink}"
    textColor: "{colors.midnight-ground}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  chip-skill:
    backgroundColor: "{colors.midnight-deep}"
    textColor: "{colors.midnight-ink}"
    rounded: "{rounded.none}"
  card-flagship:
    backgroundColor: "{colors.dark-hour-cyan}"
    textColor: "{colors.midnight-ground}"
    rounded: "{rounded.none}"
    padding: "40px"
---

# Design System: Camilo Parra — The Dark Hour

## Overview

**Creative North Star: "The Dark Hour"**

The portfolio lives in the hidden hour after midnight. A WebGL ordered-dither moon and sea fill the background, a slanted pause menu sits in front of it, and every section is a menu command stamped with its own minute (`00:10` Status through `00:59` Contact). The clock starts at `00:00` in the hero and ends at `01:00` in the footer, where the theme inverts as the hour closes. The grammar is borrowed from a JRPG pause menu (Persona 3 Reload's midnight blue, slanted cuts and hour markers) but the content is entirely Camilo's own. No game assets, logos or names ship.

Density is low and the type is loud: huge tilted condensed italics against wide fields of dithered blue, with dense mono readouts as the counterweight. Dithering, through Bayer 8×8 ordered matrices and ASCII ramps, is the one image language. Photos, project plates and the night-drive game all pass through it, so placeholder art and real art look like they belong to the same world.

The look turns down the centred hairline dev column with a round avatar, and it turns down the Persona 5 red/black collage and the Mass Effect HUD explored during direction (mocks in `.impeccable/mocks/`).

**Key Characteristics:**
- One cyan on midnight blue; Day mode is the same kit worn away.
- Condensed italic display, always tilted -6°.
- Parallelogram "blades" for selection and buttons; no rounded corners anywhere.
- Every image is dithered or ASCII; the background is a live shader.
- Clock hours as section numerals.

## Colors

Three values carry the whole site, ground, deep blue and cyan, with ink on top. Midnight is a slate blue-grey with softened ink and a muted cyan (body text sits near 11:1 rather than a glaring 17:1). Day is the brighter away kit with the full cyan.

### Primary
- **Midnight Cyan / Dark Hour Cyan**: the one accent, muted on Midnight and bright on Day. It marks the selection blade, the MAGI flagship card, the moon, focus rings, `::selection` and hover fills. As a text colour on Day it darkens to **Day Cyan Ink** so it passes AA on the pale ground.

### Neutral
- **Midnight Ground / Day Ground**: the page, the scrims behind copy over the sea (at 80–85% opacity), and the text on cyan.
- **Midnight Deep / Day Deep**: the giant clock numerals, arcana numerals, skill chips, disabled CV button and pending photo plates. It's a tone, never a text colour for content.
- **Ink / Ink Dim**: primary text and secondary copy (intros, mono labels, metadata).
- **Line**: hairline rules in tables, lists and form fields, and the dashed outline of pending content.

### Named Rules
**The Home/Away Kit Rule.** Themes are value swaps on the same tokens (`--ground`, `--deep`, `--accent`, `--ink`, …). Never add a colour that exists in one theme only.

**The One Cyan Rule.** Cyan is the only hue. Status, success and emphasis all use cyan or ink. A second accent breaks the world.

**The Scrim Rule.** Body copy that sits over the dither sea gets a ground-coloured scrim (`bg-ground/80`) so the moving particles never drop contrast below AA.

## Typography

**Display Font:** Barlow Condensed ExtraBold Italic (800), uppercase, via `next/font`
**Body Font:** Figtree (variable)
**Label/Mono Font:** JetBrains Mono, tabular numbers

**Character:** A condensed italic with rounded bowls reads like a game's menu voice without boxy squareness. Figtree's open, round forms carry the long reading, and the terminal mono reads like the save file.

### Hierarchy
- **Display** (800 italic, `clamp(5rem,13vw,11rem)`, 0.86): the hero name and the MAGI title only.
- **Headline** (800 italic, `clamp(3.25rem,8vw,7rem)`, 0.86): section titles, tilted, with a diagonal wipe on first view.
- **Title** (800 italic, `clamp(2rem,3.3vw,3.5rem)`): menu commands, project names and the Save Data label.
- **Body** (400, 1.0625rem, 1.65): bios and descriptions, capped near 50–60ch.
- **Label** (mono, 0.75rem, uppercase, 0.02em): readouts, roles, chip headers, form labels, the `00:00 · MIDNIGHT` status.

### Named Rules
**The Tilt Rule.** Display type is rotated -6° from its left origin (`.tilt`). Body and mono copy never tilt.

**The Headroom Rule.** At line-height 0.86, accents (Í, Ó) rise above the line box. Never clip display text to its exact box. The section wipe pads its clip polygon by 40% vertically for this reason.

## Layout

A single scrolling page inside a 90rem container. One fluid side gutter, `--gutter: clamp(1.5rem, 6vw, 6rem)`, is shared by every section, the navbar and the footer: 24px on phones and about 86px at 1440. Sections are separated by 112px of padding on mobile and 160px from `md`. Each section opens with its head: the tilted title on the left, with a mono cyan sub-label under it giving the plain meaning ("Testimonials", "Get in touch"), with the minute numeral in Deep behind it on the right. Below `md` the numeral stacks above the title instead of colliding with it.

The hero is one `min-h-svh` viewport. On desktop (`lg`) it is a three-column grid: name, lede and CV on the left, the dithered portrait at the same tilt in the centre, the vertical blade menu on the right. Mobile collapses to name, lede, CV and MAGI, with the portrait following below the fold, which is accepted: name, MAGI and CV are the ten-second essentials. The status readout (location, date and theme) pins to the bottom edge, and the EN/ES and theme toggles sit top right. On desktop the whole hero fits one browser window: the name, numeral, portrait and menu are sized with `svh` caps, and the text column widens below `xl`. Spanish strings run about 15% longer, so the hero is verified in EN and ES at 1920×970, 1536×730, 1440×900, 1366×657, 1280×720 and 1024×680. The hero clock reads a fixed `00:00` in both themes.

Projects alternate image and text sides from `md`. The flagship MAGI card spans full width on cyan.

## Elevation & Depth

No shadows. Depth comes from three planes: the fixed WebGL sea (back), the Deep-coloured clock numerals (middle), and content with ground scrims (front). Tilt and overlap make the planes read without blur or elevation.

**The No-Shadow Rule.** Separation comes from scrims, tone and tilt. A drop shadow would contradict the flat dither print.

## Shapes

Hard edges everywhere (radius 0). The signature shape is the **blade**: a parallelogram cut with `clip-path: polygon(0.6em 0, 100% 0, calc(100% - 0.6em) 100%, 0 100%)`. It's used for selection, buttons, chips and the testimonial avatar slots. The hero portrait uses a wider version of the same cut (14% inset). Pending content gets a 1px dashed Line outline at a 4px offset, which is the visual contract for "the owner still has to supply this".

## Components

### Blade Menu (signature)
The pause-menu list, shared by the hero (vertical, tilted) and the navbar (horizontal). A single absolutely positioned cyan blade glides (500ms, ease-out-expo) to the hovered or focused command and rests on the active section. In the hero it rests on Work. The selected label switches to on-accent and must paint above the blade, so each link is `position: relative`. `aria-current="location"` marks the active section. With `subs`, each command carries a mono sub-label with its plain meaning, used in the hero and the mobile dialog. On desktop the navbar stays hidden while the hero is in view (the hero menu already does its job) and slides in once you scroll past. Below `lg` the menu lives in a full-screen `<dialog>`; the blade re-measures with a ResizeObserver once the dialog opens. A skip link ("Skip to projects") is the first tab stop.

### Buttons
- **Shape:** blade cut, no radius.
- **Save Data (CV):** ink fill, ground text, display label with a mono sub-label. Hover fills cyan and nudges the download icon down. Until a CV exists it renders disabled in Deep with the pending outline.
- **Source / Download:** small blades. Ink fill for Source, an outlined ghost for Download. On the cyan MAGI card they invert to ground.

### Chips
- **Skill chips:** Deep blade with ink text, grouped under mono headers (Languages / Frameworks & Platforms / Tools).
- **Query chips** (MAGI demo): cyan when selected, Deep when idle. They are `aria-pressed` toggles; the results list is `aria-live="polite"`.

### Cards / Containers
- **Flagship card:** full cyan field, 24–40px padding, holding the interactive search demo in a ground panel. The demo labels itself as illustrative.
- **Bond cards:** ground scrim at 85%, rotated ±1–2° and staggered vertically, each with a huge Deep arcana numeral (I–III) rising above it. While no testimonials exist, a single pending card shows instead of three.
- **Collapsed placeholders:** empty slots (Garage, Library) collapse to one pending line rather than a stack of empty rows.

### Inputs / Fields
Underline-only fields (Line bottom border), mono uppercase labels, a cyan caret and a cyan focus ring. Until an email exists the contact form is not rendered; a large cyan blade ("Message me on GitHub") and a one-line note take its place.

### Dither imagery
`DitherImage` (Bayer-dithered photo), `AsciiImage` (ASCII ramp) and procedural `DitherPlate`s for projects without screenshots. They read theme colours at runtime, so they re-ink on the theme swap.

### Motion
One easing, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Motion is damped: blade glide 500ms, colour fades 300ms, section wipe 900ms once. Only menu cuts snap. The sea ripples under the pointer and pauses offscreen. `prefers-reduced-motion` removes wipes, transitions and the sea's animation.

## Do's and Don'ts

### Do:
- **Do** put every image through the dither or ASCII pipeline, including real photos when they arrive.
- **Do** give each new section a minute between `00:00` and `01:00` and a tilted headline.
- **Do** use the blade cut for any new selectable or pressable surface.
- **Do** put a ground scrim behind any copy placed over the sea.
- **Do** mark missing owner content with `.pending` and say so in the copy, both languages.

### Don't:
- **Don't** introduce rounded corners, drop shadows or a second accent hue.
- **Don't** use Atlus or Persona logos, characters, fonts or names. Borrow the grammar only.
- **Don't** clip display type to its exact line box; accents need headroom.
- **Don't** invent testimonials, employers, dates or metrics to fill a pending slot.

## Provenance

- `public/img/avatar.jpg`: Camilo's GitHub avatar, used as a **stand-in** portrait and rendered only through the dither/ASCII components. Replace with a real photo (`portrait` in `lib/content.ts`).
- All other imagery (sea, moon, project plates, night drive) is procedural, generated at runtime by shaders and canvas code in `components/`. No other raster assets ship.

## Review

Finish review, 2026-10-20: 1440×900 and 390×844, Midnight/EN and Day/ES, full page and hero.

Fixed in this round:
- The blade covered the selected label. Links are now positioned above it.
- The section wipe clipped accents ("ENVÍA").
- The Bonds numeral overlapped the intro.
- Mobile section numerals collided with titles.
- The ES hero overflowed 900px.

**Verdict:** ships as a complete world. Outstanding items are owner content only (photos, CV, email, LinkedIn, testimonials, experience, education, demos, after-hours picks).

Polish pass, 2026-10-20: Midnight retuned from near-black navy to a slate blue-grey with softened ink and a muted cyan. Display moved from Archivo condensed to Barlow Condensed ExtraBold Italic, and body to Figtree, for rounder, more readable forms. The side gutter was widened and unified into `--gutter`. Re-verified at 1440×900 and 390×844 in Midnight/EN and Day/ES; the ES hero still fits 900px.

Critique pass, 2026-10-20: plain sub-labels under every menu command and section title; navbar hidden over the desktop hero; hero fits one window from 1024×680 up, EN and ES; empty placeholders collapsed and the dead contact form replaced by a GitHub call to action; skip link, footer focus ring on the light band, and MAGI toggles moved to `aria-pressed`. Fixed the mobile menu blade measuring 0×0 inside the closed dialog.
