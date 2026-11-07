// All copy lives in ./en and ./es (es is typed against en). Import from "@/lib/content".

import { en } from "./en";
import { es } from "./es";

export { links, type ArtId } from "./links";
export type { Content } from "./en";

export const content = { en, es };
export type Lang = keyof typeof content;
