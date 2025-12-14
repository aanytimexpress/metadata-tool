// lib/mistralClient.ts

export async function generateWithMistral(prompt: string) {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error("Mistral API failed");
  }

  const data = await res.json();

  return data.choices[0].message.content;
}
