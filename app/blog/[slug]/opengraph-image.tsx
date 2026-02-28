import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#fafafa",
            fontSize: 48,
          }}
        >
          Post not found
        </div>
      ),
      size,
    );
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          padding: "60px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
            }}
          >
            datadiego.com
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "900px",
            }}
          >
            {post.title}
          </div>
          {post.excerpt && (
            <div
              style={{
                fontSize: 24,
                color: "#a1a1aa",
                lineHeight: 1.4,
                maxWidth: "800px",
              }}
            >
              {post.excerpt.length > 140
                ? post.excerpt.slice(0, 140) + "..."
                : post.excerpt}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {post.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 16,
                  color: "#a1a1aa",
                  backgroundColor: "#27272a",
                  padding: "4px 12px",
                  borderRadius: "6px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          {date && (
            <div style={{ fontSize: 18, color: "#71717a" }}>{date}</div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
