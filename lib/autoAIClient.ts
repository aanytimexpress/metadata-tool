import { generateWithMistral } from "./mistralClient"

export async function generateAutoAI({
  provider,
  apiKey,
  prompt,
  model,
}: {
  provider: "openai" | "mistral"
  apiKey: string
  prompt: string
  model: string
}) {
  if (provider === "mistral") {
    return generateWithMistral({ apiKey, prompt, model })
  }

  // fallback OpenAI
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await res.json()
  return data.choices[0].message.content
}
