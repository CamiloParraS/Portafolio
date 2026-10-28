---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

## Scope

Single-page portfolio (`app/page.tsx` and its section components). Mode: Experience. The work leads from the first viewport.

## Audience and job

Recruiters (internships), remote/international companies, peers. Within one viewport they should know who Camilo is, see MAGI, and be able to grab the CV. Explorers then go through menu "commands": Work, About, Social Link (testimonials), Record (experience + education), Velvet Room (cars + games), Contact.

## Constraints

EN/ES toggle, Day/Dark Hour themes, each section is its own component, ASCII/dither is the signature, cyan is the one main colour. Testimonials, experience, education, photos, CV and demos are placeholders the user fills in later. Never invent quotes or employers. Translate the game's grammar into Camilo's own; ship no Atlus assets, logos or names.

## Direction contract

THESIS: The portfolio lives in the hidden hour after midnight. A dithered moonlit sea sits behind a slanted pause menu, and every section is a menu command. It refuses the centred hairline dev-column with a round avatar.

OWN-WORLD: Midnight #050c2e ground, deep #0d2a7a, one cyan #3ec6ff, ink #eaf6ff. Day swaps the same three values like a home/away kit. Archivo condensed black italic tilted -8deg for display, JetBrains Mono for labels and ASCII. A WebGL ordered-dither moon and sea, cyan parallelogram "blades" as the selection state, and the 00:00 clock.

STORY: The visitor sees a person, MAGI and a Save Data button. Scrolling, they open each command, believe Camilo builds deep systems and has a life outside code, and then reach out.

FIRST VIEWPORT: Giant 00:00 behind on the left. The name in tilted black italic, left. A dithered portrait cut-in in the centre-right at the same tilt. The nav is a slanted menu on the right with a cyan blade on the active item. "Save Data · CV" sits bottom-left, with the date and Dark Hour readout and EN/ES bottom-right.

FORM: The Dark Hour, #3 on the steered list (Persona 3 Reload grammar). seed:797a3c93a85ee117. Signature interaction: the menu blade slices to the hovered or active command, and the cursor ripples the dithered sea. Motion is damped. Only menu cuts snap.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
