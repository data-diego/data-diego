import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const projects = [
  {
    title: "datadiego.com",
    description:
      "Personal website and blog with AI-powered chat and blog summaries.",
    tech: ["Next.js", "Convex", "Tailwind CSS", "OpenRouter"],
    link: "https://github.com/datadiego/datadiego.com",
  },
  {
    title: "Data Pipeline Toolkit",
    description:
      "Tools for building and managing ETL, streaming, and batch processing pipelines.",
    tech: ["Python", "Kafka", "PostgreSQL", "Docker"],
    link: "https://github.com/datadiego",
  },
  {
    title: "AI Code Assistant",
    description:
      "Intelligent code review and generation assistant powered by LLMs.",
    tech: ["TypeScript", "OpenAI", "VS Code API", "Node.js"],
    link: "https://github.com/datadiego",
  },
];

export function Projects() {
  return (
    <section id="projects" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <h2 className="text-lg font-semibold tracking-tight mb-6">Projects</h2>
        <div className="space-y-6">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-medium group-hover:underline underline-offset-4">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tech.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="text-[11px] px-1.5 py-0 font-normal"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <svg
                  className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
