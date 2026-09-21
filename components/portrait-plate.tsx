import { DitheredImage, DitheredField } from "@/components/paper-shaders";
import { cn } from "@/lib/utils";

/** Plate: animated square portrait, caption rule, and a dither field soaking up spare height. */
export function PortraitPlate({ className }: { className?: string }) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <DitheredImage
        src="/profile.png"
        size={4}
        animated
        className="aspect-square w-full"
      />
      <figcaption className="paper-label border-y border-foreground/25 px-3 py-1.5">
        Fig. 1 — datadiego, one ink, Bayer 4×4
      </figcaption>
      <DitheredField shape="swirl" className="min-h-24 w-full flex-1" />
    </figure>
  );
}
