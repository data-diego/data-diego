"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostEditor } from "@/components/admin/post-editor";
import { useParams } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as Id<"posts">;
  const post = useQuery(api.posts.getById, { id });

  if (post === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Edit post</h2>
      <PostEditor
        initialData={{
          id: post._id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          published: post.published,
          aiSummary: post.aiSummary,
        }}
      />
    </div>
  );
}
