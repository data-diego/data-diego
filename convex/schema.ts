import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    authorId: v.id("users"),
    aiSummary: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "publishedAt"]),
});
