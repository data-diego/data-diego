"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/blur-fade";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { BlogCard } from "@/components/blog/blog-card";

export function BlogPreview() {
  const posts = useQuery(api.posts.listPublished);
  const { isAdmin } = useIsAdmin();

  if (!posts || posts.length === 0) return null;

  const displayed = posts.slice(0, 4);

  return (
    <section id="blog" className="pt-12">
      <div className="max-w-2xl mx-auto px-6">
        <Separator className="mb-12" />
        <BlurFade>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Blog</h2>
            {isAdmin && (
              <Link
                href="/admin/posts/new"
                className="size-7 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground/60 hover:border-foreground hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            )}
          </div>
        </BlurFade>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
          {displayed.map((post, i) => (
            <BlurFade key={post._id} delay={0.05 + i * 0.08}>
              <div className="group/post relative">
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
                    className="absolute top-3 right-3 z-10 size-7 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white/60 opacity-0 group-hover/post:opacity-100 hover:text-white hover:border-white/40 transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </Link>
                )}
              </div>
            </BlurFade>
          ))}
        </div>
        {posts.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mt-6 text-center">
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
              >
                See all posts &rarr;
              </Link>
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
