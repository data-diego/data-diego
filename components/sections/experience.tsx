"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Panel } from "@/components/panel";
import { BlurFade } from "@/components/blur-fade";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { InlineEditExperience } from "@/components/admin/inline-edit-experience";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

type ExperienceItem = NonNullable<
  ReturnType<typeof useQuery<typeof api.experiences.list>>
>[number];

function ExpLogo({
  exp,
  size,
  className = "",
}: {
  exp: ExperienceItem;
  size: "sm" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? "size-12" : "size-10";
  if (exp.imageUrl) {
    return (
      <img
        src={exp.imageUrl}
        alt={exp.company}
        className={`${px} rounded-full object-cover shadow-sm ${size === "sm" ? "ring-2 ring-background" : ""} ${className}`}
      />
    );
  }
  return (
    <div
      className={`${px} rounded-full ${exp.color} flex items-center justify-center text-white text-sm font-bold shadow-sm ${size === "sm" ? "ring-2 ring-background" : ""} ${className}`}
    >
      {exp.logo}
    </div>
  );
}

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

export function Experience({ className }: { className?: string }) {
  const experiences = useQuery(api.experiences.list);
  const { isAdmin } = useIsAdmin();
  const [active, setActive] = useState<ExperienceItem | null>(null);
  // Only allow the description to scroll once the open/layout animation has settled,
  // otherwise the resizing container shows a jumping scrollbar mid-animation.
  const [contentScrollable, setContentScrollable] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | undefined>(
    undefined,
  );
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // Commit overflow-hidden synchronously while the modal is still mounted, then close — so the
  // exit (shrink) animation, which clones the last-rendered markup, never shows a scrollbar.
  const closeModal = useCallback(() => {
    flushSync(() => setContentScrollable(false));
    setActive(null);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, closeModal]);

  useOutsideClick(ref, () => closeModal());

  if (!experiences || (experiences.length === 0 && !isAdmin)) return null;

  return (
    <>
      <Panel
        id="work"
        href="/work"
        className={className}
        label="Datadiego on work"
        action={
          isAdmin && (
            <button
              onClick={() => {
                setEditingExp(undefined);
                setEditOpen(true);
              }}
              className="paper-label hover:text-foreground!"
              aria-label="Add experience"
            >
              + add
            </button>
          )
        }
      >
        {/* Expanded overlay */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active ? (
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`button-${active._id}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-background rounded-full h-8 w-8 border border-border"
                onClick={() => closeModal()}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active._id}-${id}`}
                ref={ref}
                onLayoutAnimationComplete={() => setContentScrollable(true)}
                className="glass-surface relative w-full max-w-[500px] h-fit max-h-[90%] flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <LiquidGlass
                  radius={16}
                  scale={48}
                  depth={30}
                  magnify={0.1}
                  chroma={0.22}
                  surfaceColor="oklch(0.22 0.025 270 / 0.26)"
                />
                <div
                  className={cn(
                    "relative z-10 p-6",
                    contentScrollable ? "overflow-y-auto" : "overflow-hidden",
                  )}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      layoutId={`logo-${active._id}-${id}`}
                      className="shrink-0"
                    >
                      <ExpLogo exp={active} size="lg" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3
                        layoutId={`title-${active._id}-${id}`}
                        className="text-base font-semibold"
                      >
                        {active.company}
                      </motion.h3>
                      <motion.p
                        layoutId={`role-${active._id}-${id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {active.role}
                      </motion.p>
                      <motion.span
                        layoutId={`period-${active._id}-${id}`}
                        className="text-xs text-muted-foreground tabular-nums"
                      >
                        {active.period}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      {active.link && (
                        <a
                          href={active.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      )}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingExp(active);
                            setEditOpen(true);
                            closeModal();
                          }}
                          className="shrink-0 size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="[scrollbar-width:none]"
                  >
                    <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {active.content}
                      </Markdown>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Card list */}
        <div className="space-y-2">
          {experiences.map((job, i) => (
            <BlurFade key={job._id} delay={0.05 + i * 0.1}>
              <motion.button
                type="button"
                layoutId={`card-${job._id}-${id}`}
                onClick={() => setActive(job)}
                className="glass-row group/card flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors relative w-full text-left"
              >
                <motion.div
                  layoutId={`logo-${job._id}-${id}`}
                  className="shrink-0"
                >
                  <ExpLogo exp={job} size="sm" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <motion.h3
                        layoutId={`title-${job._id}-${id}`}
                        className="text-sm font-semibold"
                      >
                        {job.company}
                      </motion.h3>
                      <motion.p
                        layoutId={`role-${job._id}-${id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {job.role}
                      </motion.p>
                    </div>
                    <motion.span
                      layoutId={`period-${job._id}-${id}`}
                      className="text-xs text-muted-foreground shrink-0 tabular-nums"
                    >
                      {job.period}
                    </motion.span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 mt-1 leading-relaxed">
                    {job.description}
                  </p>
                </div>
                {isAdmin ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingExp(job);
                      setEditOpen(true);
                    }}
                    className="shrink-0 size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover/card:opacity-100 hover:text-foreground hover:border-foreground transition-all"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                ) : (
                  <svg
                    className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover/card:text-muted-foreground transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
            </BlurFade>
          ))}
        </div>
      </Panel>

      <InlineEditExperience
        experience={editingExp}
        open={editOpen}
        onOpenChange={setEditOpen}
        nextOrder={(experiences?.length ?? 0) + 1}
      />
    </>
  );
}
