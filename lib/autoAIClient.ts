// lib/autoAIClient.ts

export async function generateAutoAI(prompt: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("API key missing");
  }

  // 🔍 Auto detect Mistral
  if (apiKey.startsWith("mistral-")) {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return data.choices[0].message.content;
  }

  // 🔍 Otherwise treat as OpenAI
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
