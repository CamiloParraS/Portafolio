import { ogImage } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Camilo Parra, software engineering student from Pasto, Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage("PORTFOLIO", "Software engineering student from Pasto, Colombia.");
}
