"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { useIsAdmin } from "@/hooks/use-is-admin";

export function BlogPostPageContent({ slug }: { slug: string }) {
  const post = useQuery(api.posts.getBySlug, { slug });
  const { isAdmin } = useIsAdmin();

  if (post === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (post === null) return null;

  return (
    <BlogPostContent
      title={post.title}
      content={post.content}
      tags={post.tags}
      publishedAt={post.publishedAt}
      aiSummary={post.aiSummary}
      coverImageUrl={post.coverImageUrl}
      editUrl={isAdmin ? `/admin/posts/${post._id}/edit` : undefined}
    />
  );
}
