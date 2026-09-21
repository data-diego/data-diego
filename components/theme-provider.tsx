"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="paper"
      enableSystem
      disableTransitionOnChange
      themes={["paper", "glass", "dark", "light"]}
    >
      {children}
    </NextThemesProvider>
  );
}
