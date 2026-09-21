"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
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

const THEME_ORDER = ["paper", "glass", "dark", "light"] as const;
type ThemeName = (typeof THEME_ORDER)[number];

export function Navbar() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // `paper` and `glass` are real selectable themes; `system` resolves to light/dark.
  // Before mount we render the default theme's (paper) markup to match the server.
  const current = (
    !mounted
      ? "paper"
      : theme === "system"
        ? resolvedTheme ?? "light"
        : theme ?? "light"
  ) as ThemeName;
  // Gate on `mounted` so the first (hydration) render matches the server's non-glass
  // markup; next-themes only exposes the resolved theme after mount, so reading it
  // earlier would swap in the glass pills and trip a hydration mismatch.
  const isGlass = mounted && current === "glass";
  const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];

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

  // In glass mode the navbar is a set of floating glass pills rather than a solid bar.
  const pill = "glass-chip rounded-full";

  // Paper mode: a full-width tab bar, like a printed form header.
  if (current === "paper") {
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

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        isGlass
          ? "bg-transparent"
          : mounted && scrolled
            ? "bg-background/80 backdrop-blur-sm border-b border-border/50"
            : "bg-transparent border-b border-transparent"
      )}
    >
      <nav
        className={cn(
          "relative z-10 max-w-2xl mx-auto flex items-center justify-between px-6",
          isGlass ? "h-16" : "h-14"
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-mono text-sm font-medium tracking-tight transition-opacity",
            isGlass ? cn(pill, "px-4 py-2") : "hover:opacity-60"
          )}
        >
          datadiego
        </Link>

        <div className={cn("flex items-center", isGlass ? "gap-2" : "gap-6")}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors max-sm:hidden",
                isGlass
                  ? cn(pill, "px-4 py-2")
                  : pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {mounted && (
            <button
              onClick={cycleTheme}
              className={cn(
                "transition-colors active:scale-90",
                isGlass
                  ? cn(pill, "flex size-9 items-center justify-center")
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Switch theme (current: ${current}, next: ${next})`}
              title={`Theme: ${current}`}
            >
              {current === "light" && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
              {current === "dark" && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              {isGlass && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
