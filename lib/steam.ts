// Shape returned by functions/api/steam.ts, and the banner URL for a Steam app.

export type SteamStatus = {
  status: "in-game" | "online" | "offline";
  current: { appid: number; name: string } | null;
  recent: { appid: number; name: string; hours: number }[];
  profileUrl?: string;
};

// Steam's CDN sends CORS headers, which the dithering canvas needs.
export const steamBanner = (appid: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;

export async function loadSteam(): Promise<SteamStatus> {
  const res = await fetch("/api/steam");
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
