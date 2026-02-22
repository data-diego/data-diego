import Link from "next/link";

export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            Hi, I&apos;m Diego
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Software engineer based in Santiago de Chile. I build full-stack
            applications with a focus on clean code, AI integration, and
            thoughtful user experiences.
          </p>
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
        </div>
      </div>
    </section>
  );
}
