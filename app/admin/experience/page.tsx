"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type EditingExperience = {
  id?: Id<"experiences">;
  company: string;
  role: string;
  period: string;
  logo: string;
  color: string;
  description: string;
  content: string;
  slug: string;
  order: number;
  imageId?: Id<"_storage">;
  imageUrl?: string | null;
  link?: string;
};

const empty: EditingExperience = {
  company: "",
  role: "",
  period: "",
  logo: "",
  color: "bg-violet-500",
  description: "",
  content: "",
  slug: "",
  order: 0,
  link: "",
};

export default function ExperiencePage() {
  const experiences = useQuery(api.experiences.list);
  const createExp = useMutation(api.experiences.create);
  const updateExp = useMutation(api.experiences.update);
  const removeExp = useMutation(api.experiences.remove);

  const [editing, setEditing] = useState<EditingExperience | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNew = () => {
    setEditing({ ...empty, order: (experiences?.length ?? 0) + 1 });
  };

  const handleEdit = (exp: NonNullable<typeof experiences>[number]) => {
    setEditing({
      id: exp._id,
      company: exp.company,
      role: exp.role,
      period: exp.period,
      logo: exp.logo,
      color: exp.color,
      description: exp.description,
      content: exp.content,
      slug: exp.slug,
      order: exp.order,
      imageId: exp.imageId,
      imageUrl: exp.imageUrl,
      link: exp.link ?? "",
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.company || !editing.role || !editing.slug) {
      toast.error("Project name, subtitle, and slug are required");
      return;
    }
    setSaving(true);
    try {
      const data = {
        company: editing.company,
        role: editing.role,
        period: editing.period,
        logo: editing.logo || editing.company.charAt(0).toUpperCase(),
        color: editing.color,
        description: editing.description,
        content: editing.content,
        slug: editing.slug,
        order: editing.order,
        imageId: editing.imageId,
        link: editing.link || undefined,
      };
      if (editing.id) {
        await updateExp({ id: editing.id, ...data });
        toast.success("Project updated");
      } else {
        await createExp(data);
        toast.success("Project created");
      }
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"experiences">, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await removeExp({ id });
    toast.success("Project deleted");
  };

  if (experiences === undefined) {
    return <div className="h-48 rounded-lg bg-muted animate-pulse" />;
  }

  if (editing) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {editing.id ? "Edit" : "New"} project
        </h2>
        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label>Project image</Label>
            <div className="flex items-start gap-4">
              <ImageUpload
                currentImageUrl={editing.imageUrl}
                currentStorageId={editing.imageId}
                onUploaded={(id) =>
                  setEditing((p) => ({ ...p!, imageId: id, imageUrl: null }))
                }
                onRemoved={() =>
                  setEditing((p) => ({
                    ...p!,
                    imageId: undefined,
                    imageUrl: null,
                  }))
                }
                className="size-20 shrink-0"
                shape="circle"
              />
              <div className="grid gap-2 flex-1">
                <Label>Project Name</Label>
                <Input
                  value={editing.company}
                  onChange={(e) => {
                    const company = e.target.value;
                    setEditing((prev) => ({
                      ...prev!,
                      company,
                      slug: prev?.id ? prev.slug : slugify(company),
                      logo: company.charAt(0).toUpperCase() || prev!.logo,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Subtitle</Label>
              <Input
                value={editing.role}
                onChange={(e) =>
                  setEditing((p) => ({ ...p!, role: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Period</Label>
              <Input
                value={editing.period}
                onChange={(e) =>
                  setEditing((p) => ({ ...p!, period: e.target.value }))
                }
                placeholder="2023 - Present"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={editing.slug}
                onChange={(e) =>
                  setEditing((p) => ({ ...p!, slug: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={editing.order}
                onChange={(e) =>
                  setEditing((p) => ({
                    ...p!,
                    order: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>External link</Label>
            <Input
              value={editing.link ?? ""}
              onChange={(e) =>
                setEditing((p) => ({ ...p!, link: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Description (short)</Label>
            <Textarea
              value={editing.description}
              onChange={(e) =>
                setEditing((p) => ({ ...p!, description: e.target.value }))
              }
              rows={2}
            />
          </div>
          <div className="grid gap-2">
            <Label>Content (supports Markdown)</Label>
            <Textarea
              value={editing.content}
              onChange={(e) =>
                setEditing((p) => ({ ...p!, content: e.target.value }))
              }
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Supports Markdown: **bold**, *italic*, [links](url), images, lists, etc.
            </p>
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
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button onClick={handleNew}>New project</Button>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No projects yet.</p>
            <Button onClick={handleNew}>Add your first project</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <Card key={exp._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {exp.imageUrl ? (
                      <img
                        src={exp.imageUrl}
                        alt={exp.company}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`size-10 rounded-full ${exp.color} flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {exp.logo}
                      </div>
                    )}
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {exp.company}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {exp.role} &middot; {exp.period} &middot; /{exp.slug}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(exp)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        void handleDelete(exp._id, exp.company)
                      }
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
