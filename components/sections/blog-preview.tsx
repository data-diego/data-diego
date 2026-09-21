"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Panel, LinkStrip } from "@/components/panel";
import { cn } from "@/lib/utils";

export function BlogPreview({ className }: { className?: string }) {
  const posts = useQuery(api.posts.listPublished);
  const { isAdmin } = useIsAdmin();

  if (!posts || posts.length === 0) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      <Panel
        id="blog"
        href="/blog"
        label="Datadiego on writing"
        action={
          isAdmin && (
            <Link
              href="/admin/posts/new"
              className="paper-label hover:text-foreground!"
            >
              + new
            </Link>
          )
        }
      >
        <ul className="space-y-4">
          {posts.slice(0, 5).map((post) => (
            <li key={post._id} className="group/post leading-snug">
              <Link
                href={`/blog/${post.slug}`}
                className="underline underline-offset-4"
              >
                *{post.title}
              </Link>
              {isAdmin && (
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  className="paper-label ml-2 opacity-0 group-hover/post:opacity-100"
                >
                  edit
                </Link>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {post.excerpt}
              </p>
              {post.publishedAt && (
                <time className="paper-label">
                  {new Date(post.publishedAt).toISOString().slice(0, 10)}
                </time>
              )}
            </li>
          ))}
        </ul>
      </Panel>
      <LinkStrip
        links={[
          { href: "/blog", label: "All posts" },
          { href: "/feed.xml", label: "RSS feed" },
        ]}
      />
    </div>
  );
}
