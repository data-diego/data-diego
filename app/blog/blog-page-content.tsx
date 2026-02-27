"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BlogList } from "@/components/blog/blog-list";

export function BlogPageContent() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? undefined;

  return (
    <>
      <h1 className="text-lg font-semibold tracking-tight mb-1">
        {tag ? `Posts tagged "${tag}"` : "Blog"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {tag ? (
          <Link
            href="/blog"
            className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
          >
            &larr; All posts
          </Link>
        ) : (
          "Thoughts on software, AI, and technology."
        )}
      </p>
      <BlogList filterTag={tag} />
    </>
  );
}
