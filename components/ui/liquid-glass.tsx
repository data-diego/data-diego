"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Aave-style liquid glass — https://aave.com/design/building-glass-for-the-web
 *
 * A self-gating, absolutely-positioned glass panel (used like DottedGlowBackground): drop it as
 * the first child of a `relative overflow-hidden` container and keep your content above it
 * (e.g. `relative z-10`). It renders nothing outside the `glass` theme, so light/dark are
 * untouched and carry zero overhead.
 *
 * Two tiers:
 *  - Tier A (everywhere): translucent tint + `backdrop-filter: blur() saturate()` frost + a 45°
 *    specular sheen + a 1px gradient edge highlight.
 *  - Tier B (Chromium only): real pixel refraction of the backdrop via an SVG `feImage` +
 *    `feDisplacementMap` chain with chromatic aberration. Detected at runtime; falls back to A.
 */

interface LiquidGlassProps {
  /** Corner radius in px — match the host container's rounding. */
  radius?: number;
  /** Refraction strength (feDisplacementMap scale). */
  scale?: number;
  /** Width of the refracting edge band in px. Defaults to `radius * 1.6`. */
  depth?: number;
  /** Ramp exponent across the edge band — higher eases the bend toward the rim. */
  curvature?: number;
  /** Chromatic aberration amount (0 = none, ~0.2 = visible rainbow fringe). */
  chroma?: number;
  /** Frost blur radius in px (feGaussianBlur stdDeviation / CSS blur). */
  blur?: number;
  /** Edge-highlight intensity, 0..1. */
  edgeHighlight?: number;
  /** Render the translucent tint layer (the glass surface fill). */
  tint?: boolean;
  /** Color of the tint layer — raise the alpha for a more opaque, frosted surface. */
  surfaceColor?: string;
  className?: string;
}

/** Signed distance to a rounded rectangle centered in a w×h box (<=0 inside, 0 at edge). */
function roundedRectSDF(
  px: number,
  py: number,
  w: number,
  h: number,
  r: number
): number {
  const qx = Math.abs(px - w / 2) - (w / 2 - r);
  const qy = Math.abs(py - h / 2) - (h / 2 - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - r;
}

/**
 * Build the displacement map as a PNG data URI. R channel encodes horizontal displacement,
 * G vertical, 128 = neutral. Interior is flat; pixels within `depth` of the rounded edge bend
 * inward (toward center) along the edge normal to recreate refraction. Only the top-left
 * quadrant is computed and mirrored into the other three (four-fold symmetry → ~25% of the work).
 */
function buildDisplacementMap(
  w: number,
  h: number,
  radius: number,
  depth: number,
  curvature: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(w, h);
  const data = img.data;
  const r = Math.max(0, Math.min(radius, Math.min(w, h) / 2));
  const band = Math.max(1, depth);

  const set = (x: number, y: number, R: number, G: number) => {
    const i = (y * w + x) * 4;
    data[i] = R;
    data[i + 1] = G;
    data[i + 2] = 128;
    data[i + 3] = 255;
  };

  const halfW = Math.ceil(w / 2);
  const halfH = Math.ceil(h / 2);

  for (let y = 0; y < halfH; y++) {
    for (let x = 0; x < halfW; x++) {
      const cx = x + 0.5;
      const cy = y + 0.5;
      const d = roundedRectSDF(cx, cy, w, h, r); // <=0 inside, 0 at edge

      let dx = 0;
      let dy = 0;
      // Only the inner edge band [-band, 0] refracts.
      if (d > -band && d <= 0) {
        const t = Math.max(0, Math.min(1, (d + band) / band)); // 0 deep, 1 at edge
        const mag = Math.pow(t, curvature);
        // Outward normal via finite differences of the SDF.
        const nx =
          roundedRectSDF(cx + 1, cy, w, h, r) -
          roundedRectSDF(cx - 1, cy, w, h, r);
        const ny =
          roundedRectSDF(cx, cy + 1, w, h, r) -
          roundedRectSDF(cx, cy - 1, w, h, r);
        const len = Math.hypot(nx, ny) || 1;
        // Bend inward (toward center) so the rim samples interior pixels — a lens.
        dx = -(nx / len) * mag;
        dy = -(ny / len) * mag;
      }

      const R = Math.max(0, Math.min(255, Math.round(128 + dx * 127)));
      const G = Math.max(0, Math.min(255, Math.round(128 + dy * 127)));
      const mx = w - 1 - x;
      const my = h - 1 - y;

      // Mirror across X inverts horizontal displacement; across Y inverts vertical.
      set(x, y, R, G);
      set(mx, y, 255 - R, G);
      set(x, my, R, 255 - G);
      set(mx, my, 255 - R, 255 - G);
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

function supportsBackdropDisplacement(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  const urlSupported =
    CSS.supports("backdrop-filter", "url(#x)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#x)");
  // Chromium is the only engine that actually refracts the backdrop via url() today.
  const isChromium =
    "chrome" in window && !/firefox|fxios/i.test(navigator.userAgent);
  return urlSupported && isChromium;
}

export function LiquidGlass({
  radius = 16,
  scale = 24,
  depth,
  curvature = 5,
  chroma = 0.22,
  blur = 2,
  edgeHighlight = 0.25,
  tint = true,
  surfaceColor = "var(--card)",
  className,
}: LiquidGlassProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [tierB, setTierB] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mapUri, setMapUri] = useState("");
  const [version, setVersion] = useState(0);

  const rawId = useId();
  // useId() contains ':' which is invalid in CSS url(#…) / selectors — strip it.
  const filterId = `lg-${rawId.replace(/:/g, "")}-${version}`;

  // Client-only feature test → never runs during SSR, so no hydration mismatch.
  useEffect(() => {
    setMounted(true);
    setTierB(supportsBackdropDisplacement());
  }, []);

  const glassActive = mounted && resolvedTheme === "glass";

  // Measure self (fills its positioned ancestor) and rebuild only on size change.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions((prev) =>
            prev.width === Math.round(width) && prev.height === Math.round(height)
              ? prev
              : { width: Math.round(width), height: Math.round(height) }
          );
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [glassActive]);

  // Regenerate the displacement map only when size or shape params change (never on scroll).
  useEffect(() => {
    if (!glassActive || !tierB) return;
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;
    const uri = buildDisplacementMap(
      width,
      height,
      radius,
      // Widen the refracting band beyond the corner radius so the lens lip reads on
      // straight edges too; the `curvature` ramp keeps the heavy bend at the very rim.
      depth ?? Math.round(radius * 1.6),
      curvature
    );
    setMapUri(uri);
    // Bump the filter id so Safari/WebKit can't serve a stale cached filter.
    setVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glassActive, tierB, dimensions.width, dimensions.height, radius, depth, curvature]);

  if (!glassActive) {
    // Passthrough: nothing rendered in light/dark. Keep the ref host so we can measure once
    // the theme switches to glass at runtime.
    return (
      <div
        ref={containerRef}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", className)}
      />
    );
  }

  const { width, height } = dimensions;
  const useRefraction = tierB && mapUri && width > 0 && height > 0;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={{ borderRadius: radius }}
    >
      {useRefraction && (
        <svg
          width="0"
          height="0"
          className="absolute"
          style={{ width: 0, height: 0 }}
        >
          <defs>
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              primitiveUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={width}
              height={height}
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={mapUri}
                x="0"
                y="0"
                width={width}
                height={height}
                preserveAspectRatio="none"
                result="map"
              />
              {/* Red channel — largest displacement. */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={scale * (1 + chroma)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispR"
              />
              <feColorMatrix
                in="dispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="red"
              />
              {/* Green channel — mid displacement. */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispG"
              />
              <feColorMatrix
                in="dispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />
              {/* Blue channel — smallest displacement. */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={scale * (1 - chroma)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispB"
              />
              <feColorMatrix
                in="dispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blue"
              />
              {/* Recombine the chromatically-split channels, then frost. */}
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
              <feGaussianBlur in="rgb" stdDeviation={blur} />
            </filter>
          </defs>
        </svg>
      )}

      {/* Backdrop: real refraction (Tier B) or a frosted blur (Tier A). */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          backdropFilter: useRefraction
            ? `url(#${filterId})`
            : `blur(${blur * 2}px) saturate(1.6)`,
          WebkitBackdropFilter: `blur(${blur * 2}px) saturate(1.6)`,
        }}
      />

      {/* Translucent tint — the glass surface fill. */}
      {tint && (
        <div
          className="absolute inset-0"
          style={{ borderRadius: radius, backgroundColor: surfaceColor }}
        />
      )}

      {/* 45° specular sheen. */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          background: `linear-gradient(45deg, var(--glass-sheen) 0%, transparent 35%, transparent 65%, oklch(1 0 0 / ${
            edgeHighlight * 0.4
          }) 100%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* 1px gradient edge highlight (mask-composite ring, as in .moving-border). */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          padding: "1px",
          background: `linear-gradient(135deg, var(--glass-edge), transparent 40%, transparent 60%, var(--glass-edge))`,
          opacity: Math.min(1, edgeHighlight * 3),
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}

export default LiquidGlass;
