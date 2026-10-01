import Image from "next/image";
import Link from "next/link";
import { FiMail, FiMapPin, FiGithub, FiRss } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    label: "Pages",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/blog", label: "Blog" },
      { href: "/tools", label: "Tools" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Elsewhere",
    links: [
      { href: "https://github.com/data-diego", label: "GitHub" },
      { href: "https://x.com/datadiego_", label: "X / Twitter" },
      { href: "/feed.xml", label: "RSS feed" },
    ],
  },
];

const socials = [
  { href: "https://github.com/data-diego", label: "GitHub", Icon: FiGithub },
  { href: "https://x.com/datadiego_", label: "X", Icon: FaXTwitter },
  { href: "/feed.xml", label: "RSS", Icon: FiRss },
];

const external = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="paper-label text-foreground/70! after:mt-2 after:block after:h-px after:w-6 after:bg-foreground/50">
      {children}
    </h2>
  );
}

// Printed on the sheet itself, with the Andes engraved along the bottom.
export function Footer() {
  return (
    <footer className="relative">
      <div className="grid grid-cols-2 gap-10 px-6 pt-12 pb-6 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:px-12">
        <div className="col-span-2 space-y-5 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 text-2xl hover:text-foreground!">
            <Image src="/icon.png" alt="" width={36} height={36} />
            datadiego
          </Link>
          <p className="max-w-xs italic leading-snug text-foreground/80">
            Translating ideas into real products people use every day.
          </p>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-center gap-3">
              <FiMail aria-hidden />
              <a href="mailto:info@datadiego.com">info@datadiego.com</a>
            </li>
            <li className="flex items-center gap-3">
              <FiMapPin aria-hidden />
              Santiago, Chile
            </li>
          </ul>
          <div className="flex gap-4 text-lg">
            {socials.map(({ href, label, Icon }) => (
              <a key={href} href={href} aria-label={label} {...external(href)}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.label} className="space-y-4">
            <Heading>{col.label}</Heading>
            <ul className="space-y-1.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} {...external(link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Heading>Say hello</Heading>
          <p className="italic leading-snug text-foreground/80">
            Got an idea, a project, or just want to talk shop? My inbox is open.
          </p>
          <Link
            href="/contact"
            className="flex items-center justify-between border border-foreground/60 pl-4 hover:text-foreground! hover:border-foreground group"
          >
            <span className="italic">Write me a note</span>
            <span className="bg-foreground text-background px-4 py-2 group-hover:bg-(--paper-accent) group-hover:text-background transition-colors">
              →
            </span>
          </Link>
        </div>
      </div>

      <p className="px-6 pb-4 text-right text-xs italic text-foreground/60 lg:px-12">
        &copy; {new Date().getFullYear()} Diego Valenzuela · Hand-set in Santiago
      </p>

      <Andes />
    </footer>
  );
}

// Engraving-style ridgelines: a hatched far range behind a solid near range and plain.
function Andes() {
  return (
    <svg
      viewBox="0 0 1200 180"
      preserveAspectRatio="xMidYMax slice"
      className="block h-32 w-full sm:h-44"
      aria-hidden
    >
      <defs>
        <pattern id="footer-hatch" width="8" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 .5h8" stroke="var(--foreground)" strokeWidth=".8" />
        </pattern>
        <pattern id="footer-grass" width="23" height="11" patternUnits="userSpaceOnUse">
          <path d="M4 10l2-5 1 5M15 9l1-4 2 4" fill="none" stroke="var(--background)" strokeWidth=".9" />
        </pattern>
      </defs>
      <path
        fill="url(#footer-hatch)"
        d="M0 180V96l70-14 60 8 90-34 50 12 80-30 50 18 70-28 40 10 60-34 30 6 50 30 80-14 40 12 70-26 50 16 90-12 60 22 80-8 80 18V180Z"
      />
      <path
        fill="var(--foreground)"
        fillOpacity=".55"
        d="M0 180v-60l110-16 90 14 120-22 100 18 90-12 130 20 110-18 120 16 120-14 110 12 100-8v68Z"
      />
      <path
        fill="var(--foreground)"
        d="M0 180v-38c160-12 380 4 600-2s440-10 600 0v40Z"
      />
      <rect y="146" width="1200" height="34" fill="url(#footer-grass)" opacity=".5" />
    </svg>
  );
}
