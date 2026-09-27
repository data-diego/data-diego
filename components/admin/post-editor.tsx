"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
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

interface PostEditorProps {
  initialData?: {
    id: Id<"posts">;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    published: boolean;
    aiSummary?: string;
    coverImageId?: Id<"_storage">;
    coverImageUrl?: string | null;
  };
}

export function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const generateSummary = useAction(api.ai.generateSummary);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(", ") ?? ""
  );
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [coverImageId, setCoverImageId] = useState<Id<"_storage"> | undefined>(
    initialData?.coverImageId
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.coverImageUrl ?? null
  );
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      toast.error("Title, slug, and content are required");
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (initialData) {
        await updatePost({
          id: initialData.id,
          title,
          slug,
          excerpt,
          content,
          tags,
          published,
          coverImageId,
        });
        toast.success("Post updated");
      } else {
        await createPost({
          title,
          slug,
          excerpt,
          content,
          tags,
          published,
          coverImageId,
        });
        toast.success("Post created");
        router.push("/admin/posts");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!content) {
      toast.error("Write some content first");
      return;
    }
    if (!initialData) {
      toast.error("Save the post first, then generate a summary");
      return;
    }

    setGeneratingSummary(true);
    try {
      await generateSummary({ postId: initialData.id });
      toast.success("AI summary generated and saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="grid gap-4 min-w-0">
        <Input
          id="title"
          aria-label="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="h-auto border-0 px-0 text-3xl md:text-3xl font-bold shadow-none focus-visible:ring-0"
        />
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your post content..."
        />
        <p className="text-xs text-muted-foreground">
          Drop or paste images directly into the editor. Content is stored as Markdown.
        </p>
      </div>

      <aside className="grid gap-4 lg:sticky lg:top-8">
        <div className="flex items-center gap-2">
          <Button onClick={() => void handleSave()} disabled={saving} className="flex-1">
            {saving ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/posts")}>
            Cancel
          </Button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Publish</span>
        </label>

        <div className="grid gap-2">
          <Label>Cover image</Label>
          <ImageUpload
            currentImageUrl={coverImageUrl}
            currentStorageId={coverImageId}
            onUploaded={(id) => {
              setCoverImageId(id);
              setCoverImageUrl(null);
            }}
            onRemoved={() => {
              setCoverImageId(undefined);
              setCoverImageUrl(null);
            }}
            className="w-full h-40"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of the post"
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="react, nextjs, typescript"
          />
          {tagsInput && (
            <div className="flex flex-wrap gap-1.5">
              {tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
            </div>
          )}
        </div>

        {initialData && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleGenerateSummary()}
            disabled={generatingSummary}
          >
            {generatingSummary ? "Generating..." : "Generate AI Summary"}
          </Button>
        )}
      </aside>
    </div>
  );
}
