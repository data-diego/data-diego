"use client";

import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/blur-fade";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { InlineEditSkill } from "@/components/admin/inline-edit-skill";
import type { Doc } from "@/convex/_generated/dataModel";
import { SkillIcon } from "@/components/skill-icon";

export function Skills() {
  const skills = useQuery(api.skills.list);
  const { isAdmin } = useIsAdmin();
  const [editingSkill, setEditingSkill] = useState<
    Doc<"skills"> | undefined
  >(undefined);
  const [editOpen, setEditOpen] = useState(false);

  if (!skills || (skills.length === 0 && !isAdmin)) return null;

  return (
    <section id="skills" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <BlurFade>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Skills</h2>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingSkill(undefined);
                  setEditOpen(true);
                }}
                className="size-7 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground/60 hover:border-foreground hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
          </div>
        </BlurFade>
        <div className="space-y-4">
          {skills.map((category, i) => (
            <BlurFade key={category._id} delay={0.05 + i * 0.08}>
              <div className="group/skill flex items-start gap-3 relative">
                <span className="text-xs font-medium text-muted-foreground w-20 shrink-0 pt-1.5 tabular-nums">
                  {category.category}
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {category.items.map((skill) => (
                    <Link
                      key={skill}
                      href={`/blog?tag=${encodeURIComponent(skill)}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                    >
                      <SkillIcon name={skill} />
                      {skill}
                    </Link>
                  ))}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingSkill(category);
                      setEditOpen(true);
                    }}
                    className="shrink-0 size-6 rounded-full border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover/skill:opacity-100 hover:text-foreground hover:border-foreground transition-all mt-0.5"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                )}
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

      <InlineEditSkill
        skill={editingSkill}
        open={editOpen}
        onOpenChange={setEditOpen}
        nextOrder={(skills?.length ?? 0) + 1}
      />
    </section>
  );
}
