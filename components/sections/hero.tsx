"use client";

import Link from "next/link";
import { BlurFade } from "@/components/blur-fade";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { DitherShader } from "@/components/ui/dither-shader";
import { EncryptedText } from "@/components/ui/encrypted-text";

export function Hero() {
  return (
    <section className="relative -mt-14 pt-14 py-16 sm:py-20 overflow-hidden">
      {/* Dotted glow — hero only, fades out at the bottom */}
      <DottedGlowBackground
        className="pointer-events-none [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
        opacity={0.4}
        gap={18}
        radius={1}
        color="rgba(0,0,0,0.4)"
        darkColor="rgba(255,255,255,0.4)"
        glowColor="rgba(120, 100, 255, 0.7)"
        darkGlowColor="rgba(160, 140, 255, 0.7)"
        speedMin={0.2}
        speedMax={0.9}
        speedScale={0.7}
      />

      <div className="relative max-w-2xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-8">
          {/* Text content */}
          <div className="flex-1 space-y-4">
            <BlurFade>
              <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                <EncryptedText
                  text="Software Engineer · Santiago, Chile"
                  revealDelayMs={40}
                  flipDelayMs={30}
                  encryptedClassName="text-muted-foreground/50"
                />
              </p>
            </BlurFade>

            <BlurFade delay={0.1}>
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                  <EncryptedText
                    text="Diego"
                    revealDelayMs={80}
                    flipDelayMs={40}
                    encryptedClassName="text-muted-foreground/40"
                    revealedClassName="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent"
                  />
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                I build full-stack applications with a focus on clean code, AI
                integration, and thoughtful user experiences.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="flex items-center gap-4 pt-2 text-sm">
                <Link
                  href="/blog"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  Blog
                </Link>
                <a
                  href="https://github.com/datadiego"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/datadiego"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:diego@datadiego.com"
                  className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                >
                  Email
                </a>
              </div>
            </BlurFade>
          </div>

          {/* Dither shader portrait */}
          <BlurFade delay={0.15}>
            <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-border ring-1 ring-foreground/5">
              <DitherShader
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80"
                gridSize={3}
                ditherMode="bayer"
                colorMode="grayscale"
                contrast={1.2}
                brightness={0.05}
                className="h-full w-full"
              />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
