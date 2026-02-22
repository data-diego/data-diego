import { Separator } from "@/components/ui/separator";

export function Contact() {
  return (
    <section id="contact" className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <h2 className="text-lg font-semibold tracking-tight mb-4">Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          I&apos;m always open to new opportunities and conversations. Feel
          free to reach out.
        </p>
        <a
          href="mailto:diego@datadiego.com"
          className="text-sm underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
        >
          diego@datadiego.com
        </a>
      </div>
    </section>
  );
}
