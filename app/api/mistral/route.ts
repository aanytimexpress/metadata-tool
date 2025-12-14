// app/api/mistral/route.ts

import { NextResponse } from "next/server";
import { generateWithMistral } from "@/lib/mistralClient";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt missing" },
        { status: 400 }
      );
    }

    const result = await generateWithMistral(prompt);

    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Mistral error" },
      { status: 500 }
    );
  }
}
