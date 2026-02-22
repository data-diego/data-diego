"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/blur-fade";
import { CometCard } from "@/components/ui/comet-card";

const projects = [
  {
    title: "datadiego.com",
    description:
      "Personal website and blog with AI-powered chat and blog summaries.",
    tech: ["Next.js", "Convex", "Tailwind CSS", "OpenRouter"],
    link: "https://github.com/datadiego/datadiego.com",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&q=80",
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    title: "Data Pipeline Toolkit",
    description:
      "Tools for building and managing ETL, streaming, and batch processing pipelines.",
    tech: ["Python", "Kafka", "PostgreSQL", "Docker"],
    link: "https://github.com/datadiego",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&q=80",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "AI Code Assistant",
    description:
      "Intelligent code review and generation assistant powered by LLMs.",
    tech: ["TypeScript", "OpenAI", "VS Code API", "Node.js"],
    link: "https://github.com/datadiego",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&q=80",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
];

export function Projects() {
  return (
    <section id="projects" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <BlurFade>
          <h2 className="text-xl font-bold tracking-tight mb-6">Projects</h2>
        </BlurFade>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <BlurFade key={project.title} delay={0.05 + i * 0.1}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <CometCard
                  rotateDepth={10}
                  translateDepth={10}
                >
                  <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col">
                    {/* Project image */}
                    <div className={`relative h-36 bg-gradient-to-br ${project.color} overflow-hidden`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h3 className="text-sm font-semibold">
                          {project.title}
                        </h3>
                        <svg
                          className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 font-normal"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CometCard>
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
