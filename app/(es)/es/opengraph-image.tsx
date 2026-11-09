import { ogImage } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Camilo Parra, estudiante de ingeniería de software de Pasto, Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage("PORTAFOLIO", "Estudiante de ingeniería de software de Pasto, Colombia.");
}
