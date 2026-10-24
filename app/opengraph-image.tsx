import { dataUri, homeCard, ogSize, paperOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Diego Valenzuela - Indie Hacker";

export default async function OGImage() {
  return paperOg(homeCard(await dataUri("og/portrait.png", "image/png")));
}
