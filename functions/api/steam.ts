// Cloudflare Pages Function: GET /api/steam
// Keeps the Steam Web API key server-side and returns only what the Now playing panel shows.
// Set STEAM_API_KEY as an encrypted variable in Cloudflare Pages (Settings > Environment variables).

type Env = { STEAM_API_KEY?: string; STEAM_ID?: string };
type Ctx = { env: Env };

const STEAM_ID = "76561198802491736";
const API = "https://api.steampowered.com";

// Only the fields we read; Steam returns much more.
type SteamJson = {
  response?: {
    players?: { personastate: number; gameid?: string; gameextrainfo?: string; profileurl?: string }[];
    games?: { appid: number; name: string; playtime_2weeks?: number }[];
  };
};

const json = (body: unknown, status = 200, maxAge = 0) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": maxAge ? `public, max-age=${maxAge}` : "no-store",
    },
  });

export const onRequestGet = async ({ env }: Ctx): Promise<Response> => {
  const key = env.STEAM_API_KEY;
  if (!key) return json({ error: "not-configured" }, 503);
  const id = env.STEAM_ID ?? STEAM_ID;

  try {
    const [summary, recent] = await Promise.all([
      fetch(`${API}/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${id}`).then((r) => r.json() as Promise<SteamJson>),
      fetch(`${API}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${id}&count=4`).then((r) => r.json() as Promise<SteamJson>),
    ]);
    const p = summary?.response?.players?.[0];
    if (!p) return json({ error: "no-profile" }, 502);

    const games = recent?.response?.games ?? [];
    const current = p.gameid ? { appid: Number(p.gameid), name: String(p.gameextrainfo ?? "") } : null;

    return json(
      {
        status: current ? "in-game" : p.personastate > 0 ? "online" : "offline",
        current,
        recent: games.map((g) => ({
          appid: g.appid,
          name: g.name,
          hours: Math.round(((g.playtime_2weeks ?? 0) / 60) * 10) / 10,
        })),
        profileUrl: p.profileurl,
      },
      200,
      60,
    );
  } catch {
    return json({ error: "steam-unreachable" }, 502);
  }
};
