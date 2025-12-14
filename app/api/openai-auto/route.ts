import { NextResponse } from "next/server"
import { generateWithAutoAI } from "@/lib/autoAIClient"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await generateWithAutoAI(body)

    return NextResponse.json({ success: true, result })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    )
  }
}
