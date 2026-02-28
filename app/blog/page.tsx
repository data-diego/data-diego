import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPageContent } from "./blog-page-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about software engineering, AI, and technology by Diego Valenzuela.",
  alternates: { canonical: "https://datadiego.com/blog" },
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        }
      >
        <BlogPageContent />
      </Suspense>
    </div>
  );
}
