import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
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
            jobTitle: "Inventor & Indie Hacker",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Santiago",
              addressCountry: "CL",
            },
            sameAs: [
              "https://github.com/data-diego",
              "https://linkedin.com/in/datadiego",
              "https://x.com/datadiego_",
            ],
          }),
        }}
      />
      <Hero />
      <About />
      <Experience />
      <BlogPreview />
      <Skills />
      <Contact />
    </>
  );
}
