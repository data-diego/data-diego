import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Diego Valenzuela.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <Contact />;
}
