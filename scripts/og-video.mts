// Renders public/og/home.mp4 (homepage og:video) and public/og/portrait.png (its still, used by
// app/opengraph-image.tsx) from the same Satori card. Needs ffmpeg and ImageMagick. Run: pnpm og:video
import { execFileSync, spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  HOME_BIO,
  HOME_NAME,
  INK,
  PORTRAIT,
  homeCard,
  paperOg,
} from "@/lib/og";

const FPS = 30;
const FRAMES = FPS * 6;
const CELL = 4; // matches <PortraitPlate>'s DitheredImage size={4}
const profile = join(process.cwd(), "public", "profile.png");
const og = (name: string) => join(process.cwd(), "public", "og", name);

// CPU port of the homepage <DitheredImage animated>: the portrait drifts under a fixed
// Bayer 4x4 grid (same drift curves as useDrift in components/paper-shaders.tsx).
function dither(t: number) {
  const [w, h] = [PORTRAIT.width, PORTRAIT.height].map((d) =>
    Math.ceil(d / CELL),
  );
  const scale = (Math.max(w, h) / 512) * (1.1 + 0.035 * Math.sin(t * 0.5));
  const x = w / 2 + 0.02 * Math.sin(t * 0.7) * w;
  const y = h / 2 + 0.02 * Math.cos(t * 0.45) * h;
  return execFileSync("magick", [
    profile,
    "-background",
    "white",
    "-flatten",
    "-virtual-pixel",
    "white",
    "-define",
    `distort:viewport=${w}x${h}`,
    "-distort",
    "SRT",
    `256,256 ${scale} 0 ${x},${y}`,
    "-colorspace",
    "gray",
    "-ordered-dither",
    "o4x4",
    // dither becomes the alpha mask over flat ink: every pixel is ink or transparent
    "-negate",
    "-background",
    INK,
    "-alpha",
    "shape",
    "-filter",
    "point",
    "-resize",
    `${CELL * 100}%`,
    "png:-",
  ]);
}
const uri = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

const typed = (text: string, start: number, f: number, perChar = 1) =>
  text.slice(0, Math.max(0, Math.floor((f - start) / perChar)));

const ffmpeg = spawn(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-f",
    "image2pipe",
    "-framerate",
    `${FPS}`,
    "-i",
    "-",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "20",
    "-movflags",
    "+faststart",
    og("home.mp4"),
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);

let frame = Buffer.alloc(0);
let portrait = "";
for (let f = 0; f < FRAMES; f++) {
  // stepped ~10fps like the homepage shader; smooth motion reads as video, not pixel art
  if (f % 3 === 0) portrait = uri((frame = dither(f / FPS)));
  const name = typed(HOME_NAME, 10, f, 2);
  const bio = typed(HOME_BIO, 10 + HOME_NAME.length * 2 + 8, f);
  const cursor = Math.floor(f / 8) % 2 ? "" : "_";
  const nameDone = name.length === HOME_NAME.length;
  const png = await (
    await paperOg(
      homeCard(
        portrait,
        nameDone ? name : name + cursor,
        nameDone ? bio + cursor : bio,
      ),
    )
  ).arrayBuffer();
  if (!ffmpeg.stdin.write(Buffer.from(png)))
    await new Promise((r) => ffmpeg.stdin.once("drain", r));
}
ffmpeg.stdin.end();
// og:image = the last frame, so the still matches where the video lands
writeFileSync(og("portrait.png"), frame);
const code = await new Promise((r) => ffmpeg.on("close", r));
if (code !== 0) throw new Error(`ffmpeg exited ${code}`);
console.log("wrote public/og/home.mp4 and public/og/portrait.png");
