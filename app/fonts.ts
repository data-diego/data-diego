import {
  Geist,
  Geist_Mono,
  Jacquard_24,
  Jacquard_12,
  Jacquarda_Bastarda_9,
  Pixelify_Sans,
  Silkscreen,
  VT323,
  Jersey_15,
  Tiny5,
  DotGothic16,
  Press_Start_2P,
  Handjet,
  Doto,
  Bitcount_Single,
  Micro_5,
  Workbench,
} from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The defaults (VT323 body, Silkscreen labels) are preloaded; the rest only download once picked in <FontPicker>.
const jacquard24 = Jacquard_24({
  variable: "--font-jacquard-24",
  weight: "400",
  preload: false,
});
const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});
const jacquard12 = Jacquard_12({
  variable: "--font-jacquard-12",
  weight: "400",
  preload: false,
});
const jacquardaBastarda9 = Jacquarda_Bastarda_9({
  variable: "--font-jacquarda-bastarda-9",
  weight: "400",
  preload: false,
});
const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  preload: false,
});
const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});
const jersey15 = Jersey_15({
  variable: "--font-jersey-15",
  weight: "400",
  preload: false,
});
const tiny5 = Tiny5({
  variable: "--font-tiny5",
  weight: "400",
  preload: false,
});
const dotGothic16 = DotGothic16({
  variable: "--font-dotgothic16",
  weight: "400",
  preload: false,
});
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  preload: false,
});
const handjet = Handjet({ variable: "--font-handjet", preload: false });
const doto = Doto({ variable: "--font-doto", preload: false });
const bitcountSingle = Bitcount_Single({
  variable: "--font-bitcount-single",
  preload: false,
});
const micro5 = Micro_5({
  variable: "--font-micro-5",
  weight: "400",
  preload: false,
});
const workbench = Workbench({ variable: "--font-workbench", preload: false });

export const fontVariables = [
  geistSans,
  geistMono,
  jacquard24,
  silkscreen,
  jacquard12,
  jacquardaBastarda9,
  pixelifySans,
  vt323,
  jersey15,
  tiny5,
  dotGothic16,
  pressStart2P,
  handjet,
  doto,
  bitcountSingle,
  micro5,
  workbench,
]
  .map((f) => f.variable)
  .join(" ");

// `scale` multiplies the root font size: pixel fonts have wildly different x-heights.
// First entry is the default (must match the fallbacks in globals.css `:root`).
export const PAPER_FONTS = [
  { label: "VT323", variable: "--font-vt323", scale: 1.25 },
  { label: "Jacquard 24", variable: "--font-jacquard-24", scale: 1.3 },
  { label: "Jacquard 12", variable: "--font-jacquard-12", scale: 1.3 },
  {
    label: "Jacquarda Bastarda 9",
    variable: "--font-jacquarda-bastarda-9",
    scale: 1.15,
  },
  { label: "Pixelify Sans", variable: "--font-pixelify-sans", scale: 1 },
  { label: "Silkscreen", variable: "--font-silkscreen", scale: 0.9 },
  { label: "Jersey 15", variable: "--font-jersey-15", scale: 1.25 },
  { label: "Tiny5", variable: "--font-tiny5", scale: 1.05 },
  { label: "DotGothic16", variable: "--font-dotgothic16", scale: 1 },
  { label: "Press Start 2P", variable: "--font-press-start-2p", scale: 0.7 },
  { label: "Handjet", variable: "--font-handjet", scale: 1.25 },
  { label: "Doto", variable: "--font-doto", scale: 1 },
  { label: "Bitcount Single", variable: "--font-bitcount-single", scale: 1 },
  { label: "Micro 5", variable: "--font-micro-5", scale: 1.5 },
  { label: "Workbench", variable: "--font-workbench", scale: 1 },
] as const;
