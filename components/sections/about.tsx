import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/blur-fade";

function InlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
    >
      {children}
    </a>
  );
}

export function About() {
  return (
    <section id="about">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <BlurFade>
          <h2 className="text-xl font-bold tracking-tight mb-4">About</h2>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-muted-foreground leading-relaxed">
            I build software and hardware with great UX design and turn my thoughts into
            tangible, day-to-day products that people actually use.
            I&apos;m interested in how augmented reality + AI will
            reshape the way we interact with the world. Creative, enthusiastic,
            and endlessly curious — I&apos;m here to build the future.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
