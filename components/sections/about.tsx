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
            Based in Santiago de Chile, I obsess over turning thoughts into
            tangible, day-to-day products that people actually use. Software,
            electronics, UX design — whatever it takes to make an idea real.
            I&apos;m deeply interested in augmented reality and how it will
            reshape the way we interact with the world. Creative, enthusiastic,
            and endlessly curious — I&apos;m here to build the future.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
