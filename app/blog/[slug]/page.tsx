import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlogPostPageContent } from "./blog-post-page-content";

const BASE_URL = "https://datadiego.com";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await fetchQuery(api.posts.listPublished, {});
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });

  if (!post) return {};

  const title = post.title;
  const description = post.excerpt;
  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });

  if (!post) notFound();

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
              url: BASE_URL,
            },
            publisher: {
              "@type": "Person",
              name: "Diego Valenzuela",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/blog/${slug}`,
            },
          }),
        }}
      />
      <BlogPostPageContent slug={slug} />
    </div>
  );
}
