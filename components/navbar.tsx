"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { FontPicker } from "@/components/font-picker";

// One route per section.
const navLinks = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];

// A full-width tab bar, like a printed form header.
export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Before mount we render the default (paper) label to match the server.
  const current = mounted && resolvedTheme === "dark" ? "dark" : "paper";
  const next = current === "dark" ? "paper" : "dark";

  const cycleTheme = () => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  const cell =
    "paper-label flex shrink-0 items-center px-2 sm:px-3 border-foreground/25 text-foreground! hover:bg-foreground hover:text-background! transition-colors";
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-foreground/25">
      <nav className="flex h-[32px] items-stretch overflow-x-auto">
        <Link href="/" className={cn(cell, "border-r font-bold")} aria-label="Home">
          ▦
        </Link>
        {navLinks.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              cell,
              "border-r",
              pathname.startsWith(tab.href) && "bg-foreground/10"
            )}
          >
            {tab.label}
          </Link>
        ))}
        <div className="flex-1" />
        <FontPicker className={cn(cell, "border-l bg-transparent outline-none cursor-pointer max-sm:hidden")} />
        <button
          onClick={cycleTheme}
          className={cn(cell, "border-l cursor-pointer")}
          aria-label={`Switch theme (current: ${current}, next: ${next})`}
        >
          ◐<span className="ml-1 max-sm:hidden">{current}</span>
        </button>
      </nav>
    </header>
  );
}
