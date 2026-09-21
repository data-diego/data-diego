"use client";

import { useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/panel";
import { BlurFade } from "@/components/blur-fade";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { InlineEditSkill } from "@/components/admin/inline-edit-skill";
import type { Doc } from "@/convex/_generated/dataModel";
import { SkillIcon } from "@/components/skill-icon";

export function Skills({ className }: { className?: string }) {
  const skills = useQuery(api.skills.list);
  const { isAdmin } = useIsAdmin();
  const [editingSkill, setEditingSkill] = useState<Doc<"skills"> | undefined>(
    undefined,
  );
  const [editOpen, setEditOpen] = useState(false);

  if (!skills || (skills.length === 0 && !isAdmin)) return null;

  return (
    <>
      <Panel
        id="skills"
        href="/tools"
        className={className}
        label="Datadiego on tools"
        action={
          isAdmin && (
            <button
              onClick={() => {
                setEditingSkill(undefined);
                setEditOpen(true);
              }}
              className="paper-label hover:text-foreground!"
              aria-label="Add skill category"
            >
              + add
            </button>
          )
        }
      >
        <div className="space-y-4">
          {skills.map((category, i) => (
            <BlurFade key={category._id} delay={0.05 + i * 0.08}>
              <div className="group/skill flex flex-col gap-1.5 relative">
                <span className="paper-label">{category.category}</span>
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
                    <svg
                      width="10"
                      height="10"
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
            </BlurFade>
          ))}
        </div>
      </Panel>

      <InlineEditSkill
        skill={editingSkill}
        open={editOpen}
        onOpenChange={setEditOpen}
        nextOrder={(skills?.length ?? 0) + 1}
      />
    </>
  );
}
