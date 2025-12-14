import { generateWithMistral } from "./mistralClient"

export async function generateAutoAI(
  provider: "gemini" | "mistral",
  apiKey: string,
  prompt: string
) {
  if (provider === "mistral") {
    return generateWithMistral(apiKey, prompt)
  }

  throw new Error("Only Mistral enabled right now")
}
