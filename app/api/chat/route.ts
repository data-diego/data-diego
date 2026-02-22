import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, stream = true } = await req.json();

  const systemMessage = {
    role: "system" as const,
    content:
      "You are a helpful assistant on Diego Valenzuela's personal website (datadiego.com). Diego is a software engineer based in Santiago de Chile. Be friendly, concise, and helpful. If asked about Diego, share that he's a full-stack developer who works with TypeScript, Python, React, Next.js, and AI/ML technologies.",
  };

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [systemMessage, ...messages],
        stream,
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: response.status }
    );
  }

  if (stream) {
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const data = await response.json();
  return NextResponse.json({
    content: data.choices[0].message.content,
  });
}

export async function PUT(req: NextRequest) {
  const { postId, summary } = await req.json();

  if (!postId || !summary) {
    return NextResponse.json(
      { error: "postId and summary are required" },
      { status: 400 }
    );
  }

  // This endpoint is called from the admin to save AI summaries
  // The actual saving happens client-side via Convex mutation
  return NextResponse.json({ success: true });
}
