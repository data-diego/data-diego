import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiPython,
  SiGo,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiFastapi,
  SiPostgresql,
  SiRedis,
  SiOpenai,
  SiDocker,
  SiGit,
  SiLinux,
  SiJavascript,
  SiRust,
  SiAmazonwebservices,
  SiGooglecloud,
  SiKubernetes,
  SiMongodb,
  SiGraphql,
  SiPrisma,
  SiFirebase,
  SiVercel,
  SiVuedotjs,
  SiSvelte,
  SiDjango,
  SiFlask,
  SiLangchain,
  SiRuby,
} from "react-icons/si";

function ConvexIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm0 3c4.1 0 7.5 3.4 7.5 7.5s-3.4 7.5-7.5 7.5S4.5 16.1 4.5 12 7.9 4.5 12 4.5z" />
    </svg>
  );
}

const iconMap: Record<string, IconType> = {
  typescript: SiTypescript,
  python: SiPython,
  go: SiGo,
  react: SiReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  "tailwind css": SiTailwindcss,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  fastapi: SiFastapi,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  redis: SiRedis,
  openai: SiOpenai,
  docker: SiDocker,
  git: SiGit,
  linux: SiLinux,
  javascript: SiJavascript,
  rust: SiRust,
  aws: SiAmazonwebservices,
  "google cloud": SiGooglecloud,
  kubernetes: SiKubernetes,
  mongodb: SiMongodb,
  graphql: SiGraphql,
  prisma: SiPrisma,
  firebase: SiFirebase,
  vercel: SiVercel,
  "vue.js": SiVuedotjs,
  vue: SiVuedotjs,
  svelte: SiSvelte,
  django: SiDjango,
  flask: SiFlask,
  langchain: SiLangchain,
  ruby: SiRuby,
  convex: ConvexIcon as unknown as IconType,
};

export function SkillIcon({ name }: { name: string }) {
  const Icon = iconMap[name.toLowerCase()];
  if (!Icon) return null;
  return <Icon className="size-3 shrink-0" />;
}
