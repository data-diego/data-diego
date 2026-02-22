"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/blur-fade";
import { useOutsideClick } from "@/hooks/use-outside-click";

type ExperienceCard = {
  company: string;
  role: string;
  period: string;
  logo: string;
  color: string;
  description: string;
  content: () => React.ReactNode;
};

const experience: ExperienceCard[] = [
  {
    company: "Freelance",
    role: "Full-Stack Engineer",
    period: "2023 - Present",
    logo: "F",
    color: "bg-violet-500",
    description:
      "Building web apps and AI integrations for clients across Latin America.",
    content: () => (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Working with startups and agencies to deliver full-stack web
          applications, from initial architecture to deployment and maintenance.
        </p>
        <p>
          Key projects include AI-powered content platforms, real-time
          dashboards, and e-commerce solutions. Built with React, Next.js,
          Python, and various cloud services.
        </p>
        <p>
          Focus on clean, maintainable code and delivering high-quality user
          experiences on tight timelines.
        </p>
      </div>
    ),
  },
  {
    company: "DataCo",
    role: "Data Engineer",
    period: "2021 - 2023",
    logo: "D",
    color: "bg-blue-500",
    description:
      "Designed ETL pipelines and real-time data systems processing millions of events daily.",
    content: () => (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Led the design and implementation of data pipelines handling millions
          of events daily using Apache Kafka, Python, and PostgreSQL.
        </p>
        <p>
          Built real-time analytics dashboards and automated reporting systems
          that reduced manual work by 80%. Managed data infrastructure on AWS
          and optimized query performance across multiple databases.
        </p>
        <p>
          Mentored junior engineers and established data engineering best
          practices across the team.
        </p>
      </div>
    ),
  },
  {
    company: "StartupCL",
    role: "Software Developer",
    period: "2019 - 2021",
    logo: "S",
    color: "bg-emerald-500",
    description:
      "Built core product features and internal tooling for a fast-growing fintech startup.",
    content: () => (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Developed core product features for a fintech platform serving
          thousands of users, including payment processing, user onboarding, and
          reporting modules.
        </p>
        <p>
          Built internal tooling that improved team productivity and reduced
          customer support response times. Worked across the full stack with
          React, Node.js, and PostgreSQL.
        </p>
        <p>
          Participated in product decisions and helped shape the technical
          roadmap during rapid growth.
        </p>
      </div>
    ),
  },
];

const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-foreground"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

export function Experience() {
  const [active, setActive] = useState<ExperienceCard | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <section id="experience" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <BlurFade>
          <h2 className="text-xl font-bold tracking-tight mb-6">
            Work Experience
          </h2>
        </BlurFade>

        {/* Expanded overlay */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active ? (
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`button-${active.company}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-background rounded-full h-8 w-8 border border-border"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.company}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-fit max-h-[90%] flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      layoutId={`logo-${active.company}-${id}`}
                      className={`shrink-0 size-12 rounded-full ${active.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}
                    >
                      {active.logo}
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3
                        layoutId={`title-${active.company}-${id}`}
                        className="text-base font-semibold"
                      >
                        {active.company}
                      </motion.h3>
                      <motion.p
                        layoutId={`role-${active.company}-${id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {active.role}
                      </motion.p>
                      <motion.span
                        layoutId={`period-${active.company}-${id}`}
                        className="text-xs text-muted-foreground tabular-nums"
                      >
                        {active.period}
                      </motion.span>
                    </div>
                  </div>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="[scrollbar-width:none]"
                  >
                    {active.content()}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Card list */}
        <div className="space-y-2">
          {experience.map((job, i) => (
            <BlurFade key={job.company} delay={0.05 + i * 0.1}>
              <motion.div
                layoutId={`card-${job.company}-${id}`}
                onClick={() => setActive(job)}
                className="group flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <motion.div
                  layoutId={`logo-${job.company}-${id}`}
                  className={`shrink-0 size-10 rounded-full ${job.color} flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-background`}
                >
                  {job.logo}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <motion.h3
                        layoutId={`title-${job.company}-${id}`}
                        className="text-sm font-semibold"
                      >
                        {job.company}
                      </motion.h3>
                      <motion.p
                        layoutId={`role-${job.company}-${id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {job.role}
                      </motion.p>
                    </div>
                    <motion.span
                      layoutId={`period-${job.company}-${id}`}
                      className="text-xs text-muted-foreground shrink-0 tabular-nums"
                    >
                      {job.period}
                    </motion.span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 mt-1 leading-relaxed">
                    {job.description}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
