"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
        });
        toast.success("Post updated");
      } else {
        await createPost({ title, slug, excerpt, content, tags, published });
        toast.success("Post created");
        router.push("/admin");
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
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
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
            rows={2}
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

        <div className="grid gap-2">
          <Label>Content (Markdown)</Label>
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content in Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="preview">
              <Card>
                <CardContent className="pt-6 prose prose-neutral dark:prose-invert max-w-none">
                  {content ? (
                    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                  ) : (
                    <p className="text-muted-foreground">
                      Nothing to preview yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Publish</span>
          </label>
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
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
