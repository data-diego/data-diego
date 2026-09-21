import { Intro } from "@/components/sections/intro";
import { DitherNotes } from "@/components/sections/dither-notes";
import { DitheredField } from "@/components/paper-shaders";
import { PortraitPlate } from "@/components/portrait-plate";
import { Experience } from "@/components/sections/experience";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Diego Valenzuela",
            url: "https://datadiego.com",
            jobTitle: "Software Engineer",
            worksFor: { "@type": "Organization", name: "BipBop Labs" },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Santiago",
              addressCountry: "CL",
            },
            sameAs: [
              "https://github.com/data-diego",
              "https://x.com/datadiego_",
            ],
          }),
        }}
      />
      {/* Bento sheet on a 3-column grid: cells auto-place (dense), so a panel that renders
          nothing — no posts, no skills — just lets the rest close ranks. */}
      <div className="grid grid-flow-dense lg:grid-cols-3 *:border-b *:border-foreground/25 lg:*:border-r">
        <Intro />
        <PortraitPlate />
        <BlogPreview />
        <Experience />
        <DitherNotes className="lg:col-span-2" />
        <DitheredField className="h-40 w-full lg:col-span-2 lg:h-auto lg:min-h-48" />
        <Contact className="lg:row-span-2" />
        <Skills className="lg:col-span-2" />
      </div>
    </>
  );
}
