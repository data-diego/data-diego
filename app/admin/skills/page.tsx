"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { Doc, Id } from "@/convex/_generated/dataModel";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type EditingSkill = {
  id?: Id<"skills">;
  category: string;
  items: string[];
  itemsInput: string;
  slug: string;
  order: number;
};

const empty: EditingSkill = {
  category: "",
  items: [],
  itemsInput: "",
  slug: "",
  order: 0,
};

export default function SkillsPage() {
  const skills = useQuery(api.skills.list);
  const createSkill = useMutation(api.skills.create);
  const updateSkill = useMutation(api.skills.update);
  const removeSkill = useMutation(api.skills.remove);

  const [editing, setEditing] = useState<EditingSkill | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNew = () => {
    setEditing({ ...empty, order: (skills?.length ?? 0) + 1 });
  };

  const handleEdit = (skill: Doc<"skills">) => {
    setEditing({
      id: skill._id,
      category: skill.category,
      items: skill.items,
      itemsInput: skill.items.join(", "),
      slug: skill.slug,
      order: skill.order,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.category || !editing.slug) {
      toast.error("Category and slug are required");
      return;
    }
    setSaving(true);
    const items = editing.itemsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const data = {
        category: editing.category,
        items,
        slug: editing.slug,
        order: editing.order,
      };
      if (editing.id) {
        await updateSkill({ id: editing.id, ...data });
        toast.success("Skill category updated");
      } else {
        await createSkill(data);
        toast.success("Skill category created");
      }
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"skills">, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await removeSkill({ id });
    toast.success("Skill category deleted");
  };

  if (skills === undefined) {
    return <div className="h-48 rounded-lg bg-muted animate-pulse" />;
  }

  if (editing) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {editing.id ? "Edit" : "New"} skill category
        </h2>
        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label>Category name</Label>
            <Input
              value={editing.category}
              onChange={(e) => {
                const category = e.target.value;
                setEditing((p) => ({
                  ...p!,
                  category,
                  slug: p?.id ? p.slug : slugify(category),
                }));
              }}
              placeholder="e.g. Languages, Frontend, Backend"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={editing.slug}
                onChange={(e) => setEditing((p) => ({ ...p!, slug: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={editing.order}
                onChange={(e) => setEditing((p) => ({ ...p!, order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Skills (comma separated)</Label>
            <Input
              value={editing.itemsInput}
              onChange={(e) => setEditing((p) => ({ ...p!, itemsInput: e.target.value }))}
              placeholder="TypeScript, Python, Go"
            />
            {editing.itemsInput && (
              <div className="flex flex-wrap gap-1.5">
                {editing.itemsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : editing.id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button onClick={handleNew}>New category</Button>
      </div>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No skill categories yet.</p>
            <Button onClick={handleNew}>Add your first category</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <Card key={skill._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{skill.category}</CardTitle>
                    <CardDescription className="text-xs">
                      /{skill.slug} &middot; {skill.items.join(", ")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(skill._id, skill.category)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
