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
            I&apos;m a software engineer based in Santiago de Chile, focused on
            building full-stack applications and AI-powered tools. In the past, I{" "}
            <InlineLink href="https://github.com/datadiego">
              built open source developer tools
            </InlineLink>
            ,{" "}
            <InlineLink href="https://linkedin.com/in/datadiego">
              worked at startups across Latin America
            </InlineLink>
            , and{" "}
            <InlineLink href="https://github.com/datadiego">
              contributed to data engineering platforms
            </InlineLink>
            . I enjoy turning complex problems into clean, elegant solutions
            and writing about what I learn along the way.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
