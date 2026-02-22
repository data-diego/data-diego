import { Separator } from "@/components/ui/separator";

export function About() {
  return (
    <section id="about">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <h2 className="text-lg font-semibold tracking-tight mb-4">About</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            I work across the full stack, from crafting responsive interfaces to
            designing robust backend systems. My focus areas include web
            development, AI/ML integration, and data engineering.
          </p>
          <p>
            I enjoy turning complex problems into simple, elegant solutions.
            When I&apos;m not coding, you can find me exploring new
            technologies, contributing to open source, or writing about software
            development.
          </p>
        </div>
      </div>
    </section>
  );
}
