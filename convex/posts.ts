import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        coverImageUrl: post.coverImageId
          ? await ctx.storage.getUrl(post.coverImageId)
          : null,
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!post || !post.published) return null;
    return {
      ...post,
      coverImageUrl: post.coverImageId
        ? await ctx.storage.getUrl(post.coverImageId)
        : null,
    };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        coverImageUrl: post.coverImageId
          ? await ctx.storage.getUrl(post.coverImageId)
          : null,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const post = await ctx.db.get(args.id);
    if (!post) return null;
    return {
      ...post,
      coverImageUrl: post.coverImageId
        ? await ctx.storage.getUrl(post.coverImageId)
        : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    coverImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("posts", {
      ...args,
      authorId: userId,
      publishedAt: args.published ? Date.now() : undefined,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    coverImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");
    const { id, ...data } = args;
    await ctx.db.patch(id, {
      ...data,
      publishedAt:
        data.published && !existing.published
          ? Date.now()
          : existing.publishedAt,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
  },
});

export const getByIdInternal = internalQuery({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateSummary = internalMutation({
  args: { id: v.id("posts"), aiSummary: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { aiSummary: args.aiSummary });
  },
});
