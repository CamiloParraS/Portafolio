// Shared, language-neutral facts: where to find Camilo, and the art ids copy refers to.

export const links = {
  email: "juanparracsfn@gmail.com",
  github: "https://github.com/CamiloParraS",
  linkedin: "https://www.linkedin.com/in/camiloparras/",
  // Drop the PDF at public/cv/camilo-parra-cv.pdf.
  cv: "/cv/camilo-parra-cv.pdf",
  // Flip to true once the PDF is in place; until then the button says it is on its way.
  cvReady: true,
};

export const repo = (name: string) => `${links.github}/${name}`;

export type ArtId = "magi" | "ghost" | "haptic" | "sophiel" | "laaf";
