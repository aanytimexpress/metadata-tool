// app/api/openai-auto/route.ts

import { NextResponse } from "next/server";
import { generateAutoAI } from "@/lib/autoAIClient";

export async function POST(req: Request) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt || !apiKey) {
      return NextResponse.json(
        { error: "Prompt or API key missing" },
        { status: 400 }
      );
    }

    const result = await generateAutoAI(prompt, apiKey);

    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "AI generation failed" },
      { status: 500 }
    );
  }
}
