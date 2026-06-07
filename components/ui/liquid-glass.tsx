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
  /** Bezel cross-section: "squircle" (Apple-like, default), "convex" (harder rim), or "power". */
  profile?: BezelProfile;
  /** Ramp exponent across the edge band — only used when `profile="power"`. */
  curvature?: number;
  /** Whole-surface magnification, 0..~0.2. Pulls the body toward center for a zoomed-lens read. */
  magnify?: number;
  /** Chromatic aberration amount (0 = none, ~0.2 = visible rainbow fringe). */
  chroma?: number;
  /** Frost blur radius in px. The surface is blurred by `blur * 2` in both tiers. */
  blur?: number;
  /** Backdrop saturation boost — keeps both tiers reading as the same frosted glass. */
  saturate?: number;
  /** Confine the frost to the refracting rim so the lens body stays clear (Tier B only, opt-in). */
  edgeFrost?: boolean;
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

/** Bezel cross-section shapes for the refracting edge band. */
type BezelProfile = "squircle" | "convex" | "power";

/**
 * Precompute the normalized refraction magnitude across the edge band (256 samples, indexed by
 * `u`: 0 = inner edge of the band, 1 = the rim). For a real glass bezel the bend at each point is
 * proportional to the surface slope, so we sample a height profile `h(u)` and use |dh/du|,
 * normalized to [0,1]. A `convex` circle ramps hard at the rim; `squircle` (Apple's preferred
 * curve) keeps the bezel optically thinner with a smoother ramp; `power` is the old t^curvature
 * heuristic kept as an escape hatch.
 */
function bezelMagnitudeLUT(
  profile: BezelProfile,
  curvature: number,
  n = 256
): Float32Array {
  const lut = new Float32Array(n);
  if (profile === "power") {
    for (let i = 0; i < n; i++) lut[i] = Math.pow(i / (n - 1), curvature);
    return lut;
  }
  // Bezel height as a function of u (flat interior at u=0, rising to the rim at u=1).
  const height = (u: number): number => {
    const x = Math.min(0.9999, Math.max(0, u));
    if (profile === "convex") return 1 - Math.sqrt(1 - x * x);
    return 1 - Math.pow(1 - Math.pow(x, 4), 0.25); // squircle
  };
  const raw = new Float32Array(n);
  const d = 1 / n;
  let max = 0;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const slope = Math.abs(height(u + d) - height(u - d));
    raw[i] = slope;
    if (slope > max) max = slope;
  }
  for (let i = 0; i < n; i++) lut[i] = max > 0 ? raw[i] / max : 0;
  return lut;
}

/**
 * Build the displacement map as a PNG data URI. R channel encodes horizontal displacement, G
 * vertical (128 = neutral); B carries a frost weight (0 = clear center, 255 = full edge frost) so
 * the filter can keep the lens body sharp and frost only the rim.
 *
 * The rounded rect is centered in a canvas padded by `pad` on every side; the padding is opaque
 * neutral gray so pixels displaced toward the rim never sample a transparent (≈black → max-shift)
 * region — the classic edge-clipping artifact. Pixels within `depth` of the edge bend inward along
 * the edge normal (a lens rim); the whole interior is pulled gently toward center by `magnify` for
 * the slightly zoomed "glass body". Only the top-left quadrant is computed and mirrored into the
 * other three (four-fold symmetry → ~25% of the work).
 */
function buildDisplacementMap(
  w: number,
  h: number,
  radius: number,
  depth: number,
  curvature: number,
  pad: number,
  profile: BezelProfile,
  magnify: number
): string {
  const W = w + pad * 2;
  const H = h + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(W, H);
  const data = img.data;
  const r = Math.max(0, Math.min(radius, Math.min(w, h) / 2));
  const band = Math.max(1, depth);
  const lut = bezelMagnitudeLUT(profile, curvature);
  const cxE = w / 2;
  const cyE = h / 2;
  const halfDiag = Math.hypot(w, h) / 2 || 1;

  const set = (x: number, y: number, R: number, G: number, B: number) => {
    const i = (y * W + x) * 4;
    data[i] = R;
    data[i + 1] = G;
    data[i + 2] = B;
    data[i + 3] = 255;
  };

  const halfW = Math.ceil(W / 2);
  const halfH = Math.ceil(H / 2);

  for (let y = 0; y < halfH; y++) {
    for (let x = 0; x < halfW; x++) {
      // Element-space coordinates: the rounded rect is centered in the padded canvas.
      const ex = x - pad + 0.5;
      const ey = y - pad + 0.5;
      const d = roundedRectSDF(ex, ey, w, h, r); // <=0 inside, 0 at edge, >0 in the pad

      let dx = 0;
      let dy = 0;
      let frost = 0;

      // Bezel refraction: only the inner edge band [-band, 0] bends.
      if (d > -band && d <= 0) {
        const t = (d + band) / band; // 0 deep, 1 at rim
        const mag = lut[Math.max(0, Math.min(255, Math.round(t * 255)))];
        // Outward normal via finite differences of the SDF.
        const nx =
          roundedRectSDF(ex + 1, ey, w, h, r) -
          roundedRectSDF(ex - 1, ey, w, h, r);
        const ny =
          roundedRectSDF(ex, ey + 1, w, h, r) -
          roundedRectSDF(ex, ey - 1, w, h, r);
        const len = Math.hypot(nx, ny) || 1;
        // Bend inward (toward center) so the rim samples interior pixels — a lens.
        dx -= (nx / len) * mag;
        dy -= (ny / len) * mag;
        frost = mag;
      }

      // Whole-surface magnification: interior samples pulled gently toward center, so the
      // backdrop reads slightly zoomed-in through the glass body (the lens, not just the rim).
      if (magnify > 0 && d <= 0) {
        const tox = cxE - ex;
        const toy = cyE - ey;
        const dist = Math.hypot(tox, toy);
        if (dist > 0) {
          const m = magnify * (dist / halfDiag);
          dx += (tox / dist) * m;
          dy += (toy / dist) * m;
        }
      }

      const R = Math.max(
        0,
        Math.min(255, Math.round(128 + Math.max(-1, Math.min(1, dx)) * 127))
      );
      const G = Math.max(
        0,
        Math.min(255, Math.round(128 + Math.max(-1, Math.min(1, dy)) * 127))
      );
      const B = Math.max(0, Math.min(255, Math.round(frost * 255)));

      const mx = W - 1 - x;
      const my = H - 1 - y;
      // The displacement field is antisymmetric about center: mirror across X inverts horizontal
      // displacement, across Y inverts vertical. The frost weight (B) is symmetric.
      set(x, y, R, G, B);
      set(mx, y, 255 - R, G, B);
      set(x, my, R, 255 - G, B);
      set(mx, my, 255 - R, 255 - G, B);
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
  profile = "squircle",
  curvature = 5,
  magnify = 0.06,
  chroma = 0.22,
  blur = 2,
  saturate = 1.6,
  edgeFrost = false,
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
  // The map and its pad are stored together so the SVG filter region always matches the PNG.
  const [map, setMap] = useState({ uri: "", pad: 0, w: 0, h: 0 });
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
    // Pad the map/filter region by at least half the max displacement (the red channel pushes
    // scale*(1+chroma)) plus the blur reach, so edge pixels never sample outside the region.
    const pad = Math.ceil(scale * (1 + Math.max(0, chroma)) * 0.5 + blur * 3);
    const uri = buildDisplacementMap(
      width,
      height,
      radius,
      // Widen the refracting band beyond the corner radius so the lens lip reads on
      // straight edges too; the profile ramp keeps the heavy bend at the very rim.
      depth ?? Math.round(radius * 1.6),
      curvature,
      pad,
      profile,
      magnify
    );
    setMap({ uri, pad, w: width, h: height });
    // Bump the filter id so Safari/WebKit can't serve a stale cached filter.
    setVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    glassActive,
    tierB,
    dimensions.width,
    dimensions.height,
    radius,
    depth,
    curvature,
    profile,
    magnify,
    scale,
    chroma,
    blur,
  ]);

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

  const useRefraction = tierB && map.uri && map.w > 0 && map.h > 0;
  // Padded filter region: feImage and <filter> must span the same padded box as the PNG.
  const fx = -map.pad;
  const fy = -map.pad;
  const fw = map.w + map.pad * 2;
  const fh = map.h + map.pad * 2;
  const maskFrost = edgeFrost && blur > 0;

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
              x={fx}
              y={fy}
              width={fw}
              height={fh}
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map.uri}
                x={fx}
                y={fy}
                width={fw}
                height={fh}
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
              {/* Recombine the chromatically-split channels. */}
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
              {/* Saturation boost so Tier B reads as the same frosted glass as the Tier A blur. */}
              <feColorMatrix
                in="rgb"
                type="saturate"
                values={String(saturate)}
                result="rgbSat"
              />

              {maskFrost ? (
                <>
                  {/* Opt-in "clear lens body": frost only the rim, keep the center sharp, using the
                      map's blue channel (frost weight) as the blend mask. */}
                  <feGaussianBlur in="rgbSat" stdDeviation={blur * 2} result="frosted" />
                  <feColorMatrix
                    in="map"
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0"
                    result="frostA"
                  />
                  <feComposite
                    in="frosted"
                    in2="frostA"
                    operator="in"
                    result="frostMasked"
                  />
                  <feComponentTransfer in="frostA" result="clearA">
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feComposite
                    in="rgbSat"
                    in2="clearA"
                    operator="in"
                    result="clearMasked"
                  />
                  {/* Premultiplied add of two complementary masks → linear blend, full alpha. */}
                  <feComposite
                    in="frostMasked"
                    in2="clearMasked"
                    operator="arithmetic"
                    k1="0"
                    k2="1"
                    k3="1"
                    k4="0"
                  />
                </>
              ) : (
                // Default: uniform frost across the whole surface, matching the Tier A blur(blur*2).
                <feGaussianBlur in="rgbSat" stdDeviation={blur * 2} />
              )}
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
            : `blur(${blur * 2}px) saturate(${saturate})`,
          WebkitBackdropFilter: `blur(${blur * 2}px) saturate(${saturate})`,
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
