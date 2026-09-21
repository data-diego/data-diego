import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { INK, MUTED, ogSize, paperOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });

  if (!post) {
    return paperOg(<div style={{ fontSize: 64 }}>Post not found</div>);
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return paperOg(
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: 30,
            color: MUTED,
            letterSpacing: "0.08em",
          }}
        >
          DATADIEGO.COM
        </div>
        <div
          style={{
            fontSize: 84,
            lineHeight: 0.95,
          }}
        >
          {post.title}
        </div>
        {post.excerpt && (
          <div
            style={{
              fontSize: 36,
              color: MUTED,
              lineHeight: 1.1,
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
                fontSize: 28,
                border: `2px solid ${INK}`,
                padding: "2px 14px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {date && <div style={{ fontSize: 28, color: MUTED }}>{date}</div>}
      </div>
    </div>,
  );
}
