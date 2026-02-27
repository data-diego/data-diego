"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Doc } from "@/convex/_generated/dataModel";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface Props {
  skill?: Doc<"skills">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder?: number;
}

export function InlineEditSkill({
  skill,
  open,
  onOpenChange,
  nextOrder = 1,
}: Props) {
  const createSkill = useMutation(api.skills.create);
  const updateSkill = useMutation(api.skills.update);
  const removeSkill = useMutation(api.skills.remove);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState("");
  const [itemsInput, setItemsInput] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(nextOrder);

  useEffect(() => {
    if (skill) {
      setCategory(skill.category);
      setItemsInput(skill.items.join(", "));
      setSlug(skill.slug);
      setOrder(skill.order);
    } else {
      setCategory("");
      setItemsInput("");
      setSlug("");
      setOrder(nextOrder);
    }
  }, [skill, nextOrder, open]);

  const handleSave = async () => {
    if (!category || !slug) {
      toast.error("Category and slug are required");
      return;
    }
    setSaving(true);
    const items = itemsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const data = { category, items, slug, order };
      if (skill) {
        await updateSkill({ id: skill._id, ...data });
        toast.success("Updated");
      } else {
        await createSkill(data);
        toast.success("Created");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!skill || !confirm(`Delete "${skill.category}"?`)) return;
    await removeSkill({ id: skill._id });
    toast.success("Deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit" : "Add"} skill category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label className="text-xs">Category</Label>
            <Input
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (!skill) setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Languages, Frontend"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Skills (comma separated)</Label>
            <Input
              value={itemsInput}
              onChange={(e) => setItemsInput(e.target.value)}
              placeholder="TypeScript, Python, Go"
            />
            {itemsInput && (
              <div className="flex flex-wrap gap-1">
                {itemsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              {skill && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDelete()}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
