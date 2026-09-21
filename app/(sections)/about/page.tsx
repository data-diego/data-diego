import type { Metadata } from "next";
import { Intro } from "@/components/sections/intro";

export const metadata: Metadata = {
  title: "About",
  description:
    "Diego Valenzuela, also known as datadiego: inventor and indie hacker based in Santiago, Chile.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <Intro />;
}
