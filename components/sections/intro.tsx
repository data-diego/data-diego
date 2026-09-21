import { Panel, LinkStrip } from "@/components/panel";
import { cn } from "@/lib/utils";

export function Intro({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Panel
        id="about"
        label="Introduction to datadiego"
        href="/about"
        bodyClassName="space-y-4"
      >
        <h1 className="text-lg leading-snug">
          *Diego Valenzuela, also known as datadiego, is a software engineer at
          BipBop Labs, inventor and indie hacker based in Santiago, Chile.
        </h1>
        <p className="leading-snug">
          *I translate ideas into real products people use every day, from code
          and electronics to design and user experience.
        </p>
        <p className="leading-snug">
          *I&apos;m interested in how augmented reality + AI will reshape the
          way we interact with the world. Creative, enthusiastic, and endlessly
          curious. I&apos;m here to build the future.
        </p>
      </Panel>
      <LinkStrip
        links={[
          { href: "https://github.com/data-diego", label: "GitHub" },
          { href: "https://x.com/datadiego_", label: "X" },
          { href: "/blog", label: "Blog" },
          { href: "/feed.xml", label: "RSS" },
          { href: "mailto:info@datadiego.com", label: "Mail" },
        ]}
      />
    </div>
  );
}
