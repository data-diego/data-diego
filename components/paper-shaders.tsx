"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Dithering,
  ImageDithering,
  PaperTexture,
  type DitheringProps,
  type ImageDitheringProps,
} from "@paper-design/shaders-react";

const TRANSPARENT = "#00000000";

// Ink colour for the pixel art: dark on the light themes (paper, light), light otherwise.
function useInk() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const theme = mounted ? resolvedTheme : "paper";
  return {
    theme,
    ink: theme === "glass" || theme === "dark" ? "#f2f0e6" : "#1c1d17",
  };
}

/** Fixed paper-texture sheet behind the page. Renders only under the paper theme. */
export function PaperBackground() {
  const { theme } = useInk();
  if (theme !== "paper") return null;
  return (
    <PaperTexture
      className="fixed inset-0 -z-10 pointer-events-none"
      fit="cover"
      scale={1.6}
      colorBack="#e9e4d0"
      colorPaper="#e9e4d0"
      colorShadow="#bdb697"
      roughness={0.25}
      roughnessSize={0.6}
      fiber={0.45}
      fiberSize={0.25}
      crumples={0.2}
      crumpleCount={6}
      folds={0.25}
      foldSizeX={0.6}
      foldSizeY={0.6}
      wrinkles={0.1}
      drops={0.15}
      seed={7}
    />
  );
}

// ImageDithering has no time uniform, so motion comes from the props: the image drifts and
// breathes under the screen-fixed Bayer grid, which makes the dither boil like hand-drawn
// line art. Stepped (~11fps) on purpose — smooth motion reads as video, not pixel art.
function useDrift(enabled: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setT(performance.now() / 1000), 90);
    return () => clearInterval(id);
  }, [enabled]);
  return {
    // scale stays > 1 so the drift never drags an image edge into view
    scale: 1.1 + 0.035 * Math.sin(t * 0.5),
    offsetX: 0.02 * Math.sin(t * 0.7),
    offsetY: 0.02 * Math.cos(t * 0.45),
  };
}

export function DitheredImage({
  src,
  animated = false,
  ...props
}: { src: string; animated?: boolean } & Omit<ImageDitheringProps, "image">) {
  const { ink } = useInk();
  const drift = useDrift(animated);
  return (
    <ImageDithering
      image={src}
      // Front covers bright pixels and a transparent front just reveals the back colour,
      // so invert: dark pixels get the ink, light ones fall through to the paper.
      inverted
      colorFront={ink}
      colorHighlight={ink}
      colorBack={TRANSPARENT}
      type="4x4"
      size={3}
      colorSteps={1}
      fit="cover"
      {...(animated && drift)}
      {...props}
    />
  );
}

export function DitheredField(props: DitheringProps) {
  const { ink } = useInk();
  return (
    <Dithering
      colorBack={TRANSPARENT}
      colorFront={ink}
      shape="warp"
      type="4x4"
      size={3}
      speed={0.25}
      {...props}
    />
  );
}
