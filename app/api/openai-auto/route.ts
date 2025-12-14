import { NextResponse } from "next/server"
import { generateAutoAI } from "@/lib/autoAIClient"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await generateAutoAI(body)

    return NextResponse.json({ success: true, result })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    )
  }
}
