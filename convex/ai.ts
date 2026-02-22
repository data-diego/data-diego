import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateSummary: ReturnType<typeof action> = action({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.runQuery(internal.posts.getByIdInternal, {
      id: args.postId,
    });
    if (!post) throw new Error("Post not found");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku",
          messages: [
            {
              role: "user",
              content: `Summarize the following blog post in 2-3 concise sentences:\n\n# ${post.title}\n\n${post.content}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    await ctx.runMutation(internal.posts.updateSummary, {
      id: args.postId,
      aiSummary: summary,
    });

    return summary;
  },
});
