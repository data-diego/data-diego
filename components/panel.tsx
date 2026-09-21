import Link from "next/link";
import { cn } from "@/lib/utils";

/** A labelled sheet section: small caps label bar on top, content below. */
export function Panel({
  id,
  label,
  href,
  action,
  className,
  bodyClassName,
  children,
}: {
  id?: string;
  label: string;
  /** The section's own route; makes the label a link. */
  href?: string;
  action?: React.ReactNode;
  /** Outer cell — grid placement lives here. */
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-12", className)}>
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-foreground/25">
        <h2 className="paper-label">
          {href ? (
            <Link href={href} className="hover:underline">
              {label}: →
            </Link>
          ) : (
            `${label}:`
          )}
        </h2>
        {action}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** The tinted "relatable links" strip: slash-separated underlined links. */
export function LinkStrip({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <section className="mt-auto border-t border-foreground/25">
      <h2 className="paper-label px-3 py-1.5 border-b border-foreground/25">
        Relatable links:
      </h2>
      <p className="px-5 py-3 bg-foreground/10">
        {links.map((link, i) => (
          <span key={link.href}>
            {i > 0 && <span className="text-muted-foreground"> / </span>}
            <a
              href={link.href}
              {...(link.href.startsWith("http") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="underline underline-offset-4"
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
    </section>
  );
}
