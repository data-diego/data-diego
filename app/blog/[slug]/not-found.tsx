import Link from "next/link";

export default function BlogPostNotFound() {
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
