import { NextResponse } from "next/server"
import { generateAutoAI } from "@/lib/autoAIClient"

export async function POST(req: Request) {
  const { provider, apiKey, prompt } = await req.json()

  const result = await generateAutoAI(provider, apiKey, prompt)

  return NextResponse.json({ result })
}
