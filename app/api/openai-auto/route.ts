import { NextResponse } from "next/server";
import { generateWithAutoAI } from "@/lib/autoAIClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await generateWithAutoAI(body);

    return NextResponse.json({
      success: true,
      data: {
        title: result.title?.replace(/[_\-]/g, " ").replace(/\.\w+$/, ""),
        description: result.description,
        keywords: result.keywords,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Metadata generation failed",
      },
      { status: 500 }
    );
  }
}
