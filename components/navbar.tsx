"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
];

const THEME_ORDER = ["light", "dark", "glass"] as const;
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

  // `glass` is a real selectable theme; `system` resolves to light/dark.
  const current = (
    theme === "system" ? resolvedTheme ?? "light" : theme ?? "light"
  ) as ThemeName;
  const isGlass = current === "glass";
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
                "text-sm transition-colors",
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
                  {/* droplet / lens */}
                  <path d="M12 2.5c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0c0-3.2 2.5-6.3 6-10.5z" />
                  <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" opacity={0.5} />
                </svg>
              )}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
