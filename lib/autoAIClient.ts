import { generateWithMistral } from "./mistralClient"

export async function generateAutoAI({
  apiKey,
  prompt,
  model,
}: {
  apiKey: string
  prompt: string
  model: string
}) {
  return generateWithMistral({
    apiKey,
    prompt,
    model,
  })
}

/* 👇 এই alias না থাকলে build ভাঙে */
export { generateAutoAI as generateWithAutoAI }
