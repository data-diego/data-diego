"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BlogPostContentProps {
  title: string;
  content: string;
  tags: string[];
  publishedAt?: number;
  aiSummary?: string;
}

export function BlogPostContent({
  title,
  content,
  tags,
  publishedAt,
  aiSummary,
}: BlogPostContentProps) {
  return (
    <article>
      <Link
        href="/blog"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back
      </Link>

      <header className="mt-6 mb-8 space-y-3">
        {publishedAt && (
          <time
            className="text-xs text-muted-foreground tabular-nums"
            dateTime={new Date(publishedAt).toISOString()}
          >
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="text-2xl font-semibold tracking-tighter">{title}</h1>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] px-1.5 py-0 font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {aiSummary && (
        <div className="mb-8 rounded-md border border-border/60 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            AI Summary
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {aiSummary}
          </p>
        </div>
      )}

      <Separator className="mb-8" />

      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </Markdown>
      </div>
    </article>
  );
}
