export async function generateWithMistral(apiKey: string, prompt: string) {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const json = await res.json()
  return json.choices?.[0]?.message?.content || ""
}
