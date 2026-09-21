import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

export const ogSize = { width: 1200, height: 630 };
export const INK = "#1c1d17";
export const MUTED = "#5d5c4b";

const asset = (name: string) => readFile(join(process.cwd(), "public", name));

export const dataUri = async (name: string, mime: string) =>
  `data:${mime};base64,${(await asset(name)).toString("base64")}`;

/** OG card on the paper sheet: og/paper.jpg is a still of <PaperBackground>, type is VT323. */
export async function paperOg(children: ReactNode) {
  const [paper, font] = await Promise.all([
    dataUri("og/paper.jpg", "image/jpeg"),
    asset("og/VT323-Regular.ttf"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#e9e4d0",
        backgroundImage: `url(${paper})`,
        color: INK,
        fontFamily: "VT323",
        padding: 40,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          border: `2px solid ${INK}`,
          padding: "44px 56px",
        }}
      >
        {children}
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "VT323", data: font, weight: 400 }] },
  );
}
