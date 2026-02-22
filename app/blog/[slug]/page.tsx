"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = useQuery(api.posts.getBySlug, { slug });

  if (post === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-sm text-muted-foreground mb-4">Post not found.</p>
        <Link
          href="/blog"
          className="text-sm underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt
              ? new Date(post.publishedAt).toISOString()
              : undefined,
            author: {
              "@type": "Person",
              name: "Diego Valenzuela",
              url: "https://datadiego.com",
            },
            publisher: {
              "@type": "Person",
              name: "Diego Valenzuela",
            },
          }),
        }}
      />
      <BlogPostContent
        title={post.title}
        content={post.content}
        tags={post.tags}
        publishedAt={post.publishedAt}
        aiSummary={post.aiSummary}
      />
    </div>
  );
}
