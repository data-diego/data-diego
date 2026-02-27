"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { BlogCard } from "@/components/blog/blog-card";

export function BlogList({ filterTag }: { filterTag?: string }) {
  const posts = useQuery(api.posts.listPublished);
  const { isAdmin } = useIsAdmin();

  if (posts === undefined) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const filtered = filterTag
    ? posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === filterTag.toLowerCase())
      )
    : posts;

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8">
        {filterTag
          ? `No posts tagged "${filterTag}". `
          : "No posts yet. Check back soon."}
        {filterTag && (
          <Link href="/blog" className="underline underline-offset-4">
            View all posts
          </Link>
        )}
      </p>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
      {filtered.map((post) => (
        <div key={post._id} className="group/item relative">
          <BlogCard
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            coverImageUrl={post.coverImageUrl}
            publishedAt={post.publishedAt}
            tags={post.tags}
          />
          {isAdmin && (
            <Link
              href={`/admin/posts/${post._id}/edit`}
              className="absolute top-3 right-3 z-10 size-7 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white/60 opacity-0 group-hover/item:opacity-100 hover:text-white hover:border-white/40 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
