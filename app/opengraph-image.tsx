import { INK, MUTED, dataUri, ogSize, paperOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Diego Valenzuela - Software Engineer";

export default async function OGImage() {
  const face = await dataUri("icon.png", "image/png");
  return paperOg(
    <div style={{ display: "flex", alignItems: "center", gap: 56, flex: 1 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={face}
        alt=""
        width={384}
        height={384}
        style={{ border: `2px solid ${INK}`, imageRendering: "pixelated" }}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 30, color: MUTED, letterSpacing: "0.08em" }}>
          DATADIEGO.COM
        </div>
        <div style={{ fontSize: 96, lineHeight: 0.95, marginTop: 12 }}>
          Diego Valenzuela
        </div>
        <div style={{ fontSize: 40, lineHeight: 1.1, marginTop: 24 }}>
          Software engineer and indie hacker based in Santiago, Chile.
        </div>
      </div>
    </div>,
  );
}
