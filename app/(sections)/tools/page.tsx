import type { Metadata } from "next";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: "Tools",
  description: "Languages, frameworks and tools Diego Valenzuela works with.",
  alternates: { canonical: "/tools" },
};

export default function Page() {
  return <Skills />;
}
