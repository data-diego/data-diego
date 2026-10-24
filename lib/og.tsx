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

export const HOME_NAME = "Diego Valenzuela";
export const HOME_BIO = "Indie hacker based in Santiago, Chile.";

// Left half of the bordered frame inside paperOg (1200x630 minus 40px margin and 2px border).
export const PORTRAIT = { width: 558, height: 546 };

/** Homepage card; the og:video script passes a dithered portrait frame and partial text. */
export const homeCard = (
  portrait: string,
  name = HOME_NAME,
  bio = HOME_BIO,
) => (
  // negative margin cancels paperOg's inner padding so the portrait bleeds to the frame
  <div style={{ display: "flex", flex: 1, margin: "-44px -56px" }}>
    <div
      style={{
        ...PORTRAIT,
        display: "flex",
        overflow: "hidden",
        borderRight: `2px solid ${INK}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={portrait} alt="" />
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        padding: "0 48px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          fontSize: 30,
          color: MUTED,
          letterSpacing: "0.08em",
        }}
      >
        DATADIEGO.COM
      </div>
      <div
        style={{
          fontSize: 96,
          lineHeight: 0.95,
          minHeight: 182,
        }}
      >
        {name}
      </div>
      <div
        style={{ fontSize: 40, lineHeight: 1.1, marginTop: 24, minHeight: 88 }}
      >
        {bio}
      </div>
    </div>
  </div>
);

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
