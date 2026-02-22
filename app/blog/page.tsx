import type { Metadata } from "next";
import { BlogList } from "@/components/blog/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about software engineering, AI, and technology by Diego Valenzuela.",
};

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-lg font-semibold tracking-tight mb-1">Blog</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Thoughts on software, AI, and technology.
      </p>
      <BlogList />
    </div>
  );
}
