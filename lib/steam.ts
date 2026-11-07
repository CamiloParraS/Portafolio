// Shape returned by functions/api/steam.ts, and the banner URL for a Steam app.

export type SteamStatus = {
  status: "in-game" | "online" | "offline";
  current: { appid: number; name: string } | null;
  recent: { appid: number; name: string; icon: string; hours: number }[];
  profileUrl?: string;
};

// Steam's CDN sends CORS headers, which the dithering canvas needs.
export const steamBanner = (appid: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;

// The 32px community icon; `hash` comes from the endpoint (empty when Steam has none).
export const steamIcon = (appid: number, hash: string) =>
  hash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg` : null;

export async function loadSteam(): Promise<SteamStatus> {
  const res = await fetch("/api/steam");
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
