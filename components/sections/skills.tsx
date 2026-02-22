import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const skills = [
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "Convex",
  "Tailwind CSS",
  "PostgreSQL",
  "Docker",
  "Git",
  "FastAPI",
  "Redis",
  "OpenAI",
  "LangChain",
  "Go",
  "Linux",
];

export function Skills() {
  return (
    <section id="skills" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <h2 className="text-lg font-semibold tracking-tight mb-4">Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
