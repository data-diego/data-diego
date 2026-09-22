import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Notion property object -> plain string. Covers the common types; unknown ones are dropped.
function plain(prop: Record<string, unknown>): string | undefined {
  const val = prop[prop.type as string] as unknown;
  switch (prop.type) {
    case "title":
    case "rich_text":
      return (val as { plain_text: string }[]).map((t) => t.plain_text).join("") || undefined;
    case "select":
    case "status":
      return (val as { name: string } | null)?.name;
    case "multi_select":
      return (val as { name: string }[]).map((s) => s.name).join(", ") || undefined;
    case "people":
      return (val as { name?: string }[]).map((p) => p.name ?? "?").join(", ") || undefined;
    case "date":
      return (val as { start: string } | null)?.start;
    case "url":
    case "email":
    case "number":
    case "checkbox":
      return val == null ? undefined : String(val);
    default:
      return undefined;
  }
}

async function notionComments(pageId: string): Promise<string[]> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return [];
  const res = await fetch(`https://api.notion.com/v1/comments?block_id=${pageId}`, {
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28" },
  });
  if (!res.ok) return [`(comments unavailable: ${res.status})`];
  const { results } = (await res.json()) as {
    results: { rich_text: { plain_text: string }[] }[];
  };
  return results.map((c) => c.rich_text.map((t) => t.plain_text).join(""));
}

// Target for a Notion database automation ("Status → Done" → "Send webhook").
// Notion posts { source, data: <page object> }; we forward it to Discord as an embed.
http.route({
  path: "/notion/done",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    if (request.headers.get("x-webhook-secret") !== process.env.NOTION_WEBHOOK_SECRET) {
      return new Response("unauthorized", { status: 401 });
    }
    const { data: page } = (await request.json()) as {
      data: { id: string; url: string; properties: Record<string, Record<string, unknown>> };
    };

    const fields = Object.entries(page.properties)
      .map(([name, prop]) => ({ name, value: plain(prop), inline: true }))
      .filter((f): f is { name: string; value: string; inline: boolean } => !!f.value);
    const title = fields.find((f) => page.properties[f.name].type === "title")?.value ?? "Untitled";
    const comments = await notionComments(page.id);

    const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `✅ ${title}`.slice(0, 256),
            url: page.url,
            fields: fields
              .filter((f) => page.properties[f.name].type !== "title")
              .slice(0, 25)
              .map((f) => ({ ...f, value: f.value.slice(0, 1024) })),
            description: comments.length
              ? comments.map((c) => `> ${c}`).join("\n").slice(0, 4096)
              : undefined,
            color: 0x57f287,
          },
        ],
      }),
    });
    return new Response(null, { status: res.ok ? 200 : 502 });
  }),
});

export default http;
