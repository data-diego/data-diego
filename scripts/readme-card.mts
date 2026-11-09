// Renders .github/profile-card.svg (the colored ASCII card in README.md) from public/profile.png.
// Needs ImageMagick. Run: pnpm readme:card
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COLS = 48;
const ROWS = 26;
const RAMP = " .`',:;!il1jI|xk$%&8W@M";
const INFO_W = 52;
const [FONT, LINE, CH, PAD] = [16, 20, 9.6, 24]; // CH: ~0.6em monospace advance

// Divide by a heavy blur to flatten the grey background gradient, so only the linework turns into ink.
const px = execFileSync("magick", [
  join(process.cwd(), "public", "profile.png"),
  ...["-alpha", "off", "-colorspace", "Gray"],
  ...["(", "+clone", "-blur", "0x40", ")", "-compose", "divide_src", "-composite"],
  ...["-gravity", "center", "-crop", "470x512+0+0", "+repage"],
  ...["-resize", `${COLS}x${ROWS}!`, "-depth", "8", "gray:-"],
]);
const art = Array.from({ length: ROWS }, (_, r) =>
  Array.from(px.subarray(r * COLS, (r + 1) * COLS), (g) => {
    const t = Math.min(1, Math.max(0, (1 - g / 255 - 0.03) / 0.3));
    return RAMP[Math.round(t * (RAMP.length - 1))];
  }).join(""),
);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const span = (cls: string, s: string) => `<tspan class="${cls}">${esc(s)}</tspan>`;
const row = (key: string, value: string) => {
  const dots = INFO_W - key.length - value.length - 5;
  return `${span("d", ". ")}${span("k", key)}:${span("d", ` ${".".repeat(dots)} `)}${span("v", value)}`;
};
const rule = (title: string, markup = esc(title)) =>
  `${markup}${span("d", ` ${"—".repeat(INFO_W - title.length - 1)}`)}`;

const info = [
  rule("diego@datadiego", `${span("t", "diego")}@${span("t", "datadiego")}`),
  row("Name", "Diego Valenzuela"),
  row("Role", "Software Engineer, tech creator"),
  row("Location", "Santiago, Chile"),
  "",
  row("Ask.About", "Web & mobile dev, UI/UX"),
  row("Ask.About", "Entrepreneurship, Arduino, VR"),
  row("Dont.Ask", "Blockchain, Stuart Little"),
  row("Dont.Ask", "Where I was on Feb 29th, 2019"),
  "",
  row("Hobbies.Music", "Chill jazz, bossa nova, samba"),
  row("Hobbies.Plays", "Saxophone, guitar"),
  row("Hobbies.Sports", "Mountain biking, football, hoops"),
  row("Hobbies.Other", "Language learning, traveling"),
  "",
  rule("- Contact"),
  row("Website", "datadiego.com"),
  row("GitHub", "data-diego"),
  row("X", "@datadiego_"),
];

const top = Math.floor((ROWS - info.length) / 2);
const infoX = PAD + (COLS + 4) * CH;
const text = (x: number, lines: string[], offset = 0) =>
  lines
    .map((l, i) => `<tspan x="${x}" y="${PAD + FONT + (i + offset) * LINE}">${l}</tspan>`)
    .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(infoX + INFO_W * CH + PAD)}" height="${PAD * 2 + ROWS * LINE}" font-family="ConsolasFallback, Consolas, 'SF Mono', Menlo, monospace" font-size="${FONT}px">
<style>
.a { fill: #c9d1d9 } .t { fill: #f0f6fc; font-weight: bold } .k { fill: #ffa657 } .v { fill: #a5d6ff } .d { fill: #616e7f }
text { white-space: pre }
</style>
<rect width="100%" height="100%" rx="15" fill="#161b22"/>
<text class="a" xml:space="preserve">
${text(PAD, art.map(esc))}
</text>
<text fill="#c9d1d9" xml:space="preserve">
${text(infoX, info, top)}
</text>
</svg>
`;

mkdirSync(join(process.cwd(), ".github"), { recursive: true });
writeFileSync(join(process.cwd(), ".github", "profile-card.svg"), svg);
