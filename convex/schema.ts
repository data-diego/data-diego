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
    coverImageId: v.optional(v.id("_storage")),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "publishedAt"]),
  experiences: defineTable({
    company: v.string(),
    role: v.string(),
    period: v.string(),
    logo: v.string(),
    color: v.string(),
    description: v.string(),
    content: v.string(),
    slug: v.string(),
    order: v.number(),
    imageId: v.optional(v.id("_storage")),
    link: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    technologies: v.array(v.string()),
    link: v.string(),
    image: v.string(),
    color: v.string(),
    slug: v.string(),
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),
  skills: defineTable({
    category: v.string(),
    items: v.array(v.string()),
    slug: v.string(),
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),
});
