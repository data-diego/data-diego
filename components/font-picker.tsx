"use client";

import { useEffect, useRef } from "react";
import { PAPER_FONTS } from "@/app/fonts";

const STORAGE_KEY = "paper-font";

function applyFont(variable: string) {
  const font = PAPER_FONTS.find((f) => f.variable === variable);
  if (!font) return;
  const root = document.documentElement.style;
  root.setProperty("--font-paper", `var(${font.variable})`);
  root.setProperty("--paper-font-scale", String(font.scale));
}

// ponytail: font is applied after mount, so a saved non-default font flashes the default on
// reload. Once a font is chosen for good, hardcode it in globals.css and delete this picker.
export function FontPicker({ className }: { className?: string }) {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ref.current) {
      ref.current.value = saved;
      applyFont(saved);
    }
  }, []);

  return (
    <select
      ref={ref}
      aria-label="Font"
      defaultValue={PAPER_FONTS[0].variable}
      onChange={(e) => {
        localStorage.setItem(STORAGE_KEY, e.target.value);
        applyFont(e.target.value);
      }}
      className={className}
    >
      {PAPER_FONTS.map((f) => (
        <option key={f.variable} value={f.variable}>
          {f.label}
        </option>
      ))}
    </select>
  );
}
