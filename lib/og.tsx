import { ImageResponse } from "next/og";

// Share card: the site's near-black ground, a cyan dither block and the one-line pitch.
export function ogImage(label: string, line: string) {
  const cells = Array.from({ length: 9 * 9 }, (_, i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    return (x * 7 + y * 13 + x * y) % 5 < 2;
  });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0d10", color: "#f3f6f7", padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#22d3ee", letterSpacing: 2 }}>{label}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 108, fontWeight: 700, letterSpacing: -4 }}>Camilo Parra</div>
            <div style={{ display: "flex", fontSize: 38, color: "#a7b1b9", marginTop: 16, maxWidth: 640 }}>
              {line}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 360, height: 360, alignSelf: "center" }}>
          {cells.map((on, i) => (
            <div key={i} style={{ width: 40, height: 40, background: on ? "#22d3ee" : "#121519" }} />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
