import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_order")
      .collect();
    return Promise.all(
      experiences.map(async (exp) => ({
        ...exp,
        imageUrl: exp.imageId
          ? await ctx.storage.getUrl(exp.imageId)
          : null,
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const exp = await ctx.db
      .query("experiences")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!exp) return null;
    return {
      ...exp,
      imageUrl: exp.imageId
        ? await ctx.storage.getUrl(exp.imageId)
        : null,
    };
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("experiences", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("experiences"),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const exp = await ctx.db.get(args.id);
    if (exp?.imageId) {
      await ctx.storage.delete(exp.imageId);
    }
    await ctx.db.delete(args.id);
  },
});
