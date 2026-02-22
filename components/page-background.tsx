"use client";

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <DottedGlowBackground
        opacity={0.35}
        gap={20}
        radius={1}
        color="rgba(0,0,0,0.4)"
        darkColor="rgba(255,255,255,0.4)"
        glowColor="rgba(120, 100, 255, 0.7)"
        darkGlowColor="rgba(160, 140, 255, 0.7)"
        speedMin={0.2}
        speedMax={0.8}
        speedScale={0.6}
        className="mask-radial-to-90%"
      />
    </div>
  );
}
