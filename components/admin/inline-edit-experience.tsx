"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ExperienceWithImage {
  _id: Id<"experiences">;
  _creationTime: number;
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
}

interface Props {
  experience?: ExperienceWithImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder?: number;
}

export function InlineEditExperience({
  experience,
  open,
  onOpenChange,
  nextOrder = 1,
}: Props) {
  const createExp = useMutation(api.experiences.create);
  const updateExp = useMutation(api.experiences.update);
  const removeExp = useMutation(api.experiences.remove);
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [logo, setLogo] = useState("");
  const [color, setColor] = useState("bg-violet-500");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(nextOrder);
  const [imageId, setImageId] = useState<Id<"_storage"> | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (experience) {
      setCompany(experience.company);
      setRole(experience.role);
      setPeriod(experience.period);
      setLogo(experience.logo);
      setColor(experience.color);
      setDescription(experience.description);
      setContent(experience.content);
      setSlug(experience.slug);
      setOrder(experience.order);
      setImageId(experience.imageId);
      setImageUrl(experience.imageUrl ?? null);
      setLink(experience.link ?? "");
    } else {
      setCompany("");
      setRole("");
      setPeriod("");
      setLogo("");
      setColor("bg-violet-500");
      setDescription("");
      setContent("");
      setSlug("");
      setOrder(nextOrder);
      setImageId(undefined);
      setImageUrl(null);
      setLink("");
    }
  }, [experience, nextOrder, open]);

  const handleSave = async () => {
    if (!company || !role || !slug) {
      toast.error("Project name, subtitle, and slug are required");
      return;
    }
    setSaving(true);
    try {
      const data = {
        company,
        role,
        period,
        logo: logo || company.charAt(0).toUpperCase(),
        color,
        description,
        content,
        slug,
        order,
        imageId,
        link: link || undefined,
      };
      if (experience) {
        await updateExp({ id: experience._id, ...data });
        toast.success("Updated");
      } else {
        await createExp(data);
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
    if (!experience || !confirm(`Delete "${experience.company}"?`)) return;
    await removeExp({ id: experience._id });
    toast.success("Deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit" : "Add"} project
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label className="text-xs">Project image</Label>
            <div className="flex items-start gap-3">
              <ImageUpload
                currentImageUrl={imageUrl}
                currentStorageId={imageId}
                onUploaded={(id) => {
                  setImageId(id);
                  setImageUrl(null);
                }}
                onRemoved={() => {
                  setImageId(undefined);
                  setImageUrl(null);
                }}
                className="size-16 shrink-0"
                shape="circle"
              />
              <div className="grid gap-1.5 flex-1">
                <Label className="text-xs">Project Name</Label>
                <Input
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (!experience) {
                      setSlug(slugify(e.target.value));
                      setLogo(e.target.value.charAt(0).toUpperCase());
                    }
                  }}
                />
              </div>
            </div>
            {!imageId && (
              <p className="text-[10px] text-muted-foreground">
                Without an image, a letter avatar ({logo || "?"}) will be shown
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Subtitle</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Period</Label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2023 - Present"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Order</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">External link</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Short description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">
              Detailed content (supports Markdown)
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
            <p className="text-[10px] text-muted-foreground">
              Supports Markdown: **bold**, *italic*, [links](url), images, lists, etc.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              {experience && (
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
