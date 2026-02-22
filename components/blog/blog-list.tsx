"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";

export function BlogList() {
  const posts = useQuery(api.posts.listPublished) as
    | Doc<"posts">[]
    | undefined;

  if (posts === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8">
        No posts yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/blog/${post.slug}`}
          className="group flex items-baseline justify-between gap-4 py-2 -mx-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-medium group-hover:underline underline-offset-4 truncate">
            {post.title}
          </span>
          <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
            {post.publishedAt &&
              new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </span>
        </Link>
      ))}
    </div>
  );
}
