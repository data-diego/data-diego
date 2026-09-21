import type { Metadata } from "next";
import { Experience } from "@/components/sections/experience";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects and experience of Diego Valenzuela.",
  alternates: { canonical: "/work" },
};

export default function Page() {
  return <Experience />;
}
