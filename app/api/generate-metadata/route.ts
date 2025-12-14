import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, filename, mimeType, apiKey, model, settings, provider } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required", errorCode: "NO_KEY" }, { status: 400 })
    }

    // Build the prompt based on settings
    let prompt = `You are a professional stock photography metadata generator. Analyze this image and generate SEO-optimized metadata.

Generate the following:
1. Title: A compelling, descriptive title (max ${settings.titleLength} characters). Do not use quotes.
2. Description: A detailed description for stock platforms (max ${settings.descriptionLength} characters). Do not use quotes.
3. Keywords: ${settings.keywordsCount} relevant keywords for searchability.`

    if (settings.keywordFormat === "single") {
      prompt += "\n\nKeyword format: Use only single-word keywords."
    } else if (settings.keywordFormat === "double") {
      prompt += "\n\nKeyword format: Use only two-word keyword phrases."
    } else {
      prompt += "\n\nKeyword format: Mix of single and multi-word keywords."
    }

    if (settings.includeKeywords) {
      prompt += `\n\nMUST include these keywords if relevant: ${settings.includeKeywords}`
    }

    if (settings.excludeKeywords) {
      prompt += `\n\nDO NOT use these keywords: ${settings.excludeKeywords}`
    }

    if (settings.filenameAsTitle) {
      const titleFromFilename = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      prompt += `\n\nUse this as the title: "${titleFromFilename}"`
    }

    if (settings.filenameOnlyMode) {
      prompt = `Based on this filename: "${filename}", generate stock photography metadata without seeing the actual image.

Generate:
1. Title: A compelling title (max ${settings.titleLength} characters)
2. Description: A description (max ${settings.descriptionLength} characters)
3. Keywords: ${settings.keywordsCount} relevant keywords`
    }

    prompt += `

Respond in this exact JSON format:
{
  "title": "your title here",
  "description": "your description here",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

    if (provider === "openai") {
      return await handleOpenAI(apiKey, model, prompt, image, mimeType, settings.filenameOnlyMode)
    } else {
      return await handleGemini(apiKey, model, prompt, image, mimeType, settings.filenameOnlyMode)
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        errorCode: "SERVER_ERROR",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 },
    )
  }
}

async function handleGemini(
  apiKey: string,
  model: string,
  prompt: string,
  image: string,
  mimeType: string,
  filenameOnlyMode: boolean,
) {
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: filenameOnlyMode
              ? [{ text: prompt }]
              : [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: image,
                    },
                  },
                ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    },
  )

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text()
    console.error("Gemini API error:", errorText)

    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: { message: errorText } }
    }

    const statusCode = geminiResponse.status
    const errorMessage = errorData?.error?.message || "Unknown error"

    if (statusCode === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          errorCode: "QUOTA_EXHAUSTED",
          message: "API key quota exhausted. Please use a different API key or wait for quota reset.",
          shouldRotateKey: true,
        },
        { status: 429 },
      )
    }

    if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          errorCode: "INVALID_KEY",
          message: "The API key is invalid or has been revoked.",
          shouldRotateKey: true,
        },
        { status: statusCode },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        errorCode: "API_ERROR",
        message: errorMessage,
      },
      { status: 500 },
    )
  }

  const geminiData = await geminiResponse.json()
  const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

  if (!textResponse) {
    return NextResponse.json(
      {
        error: "No response from Gemini",
        errorCode: "EMPTY_RESPONSE",
        message: "The AI did not return a valid response.",
      },
      { status: 500 },
    )
  }

  return parseAndReturnMetadata(textResponse)
}

async function handleOpenAI(
  apiKey: string,
  model: string,
  prompt: string,
  image: string,
  mimeType: string,
  filenameOnlyMode: boolean,
) {
  const messages: Array<{
    role: string
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
  }> = []

  if (filenameOnlyMode) {
    messages.push({
      role: "user",
      content: prompt,
    })
  } else {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${image}`,
          },
        },
      ],
    })
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text()
    console.error("OpenAI API error:", errorText)

    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: { message: errorText } }
    }

    const statusCode = openaiResponse.status
    const errorMessage = errorData?.error?.message || "Unknown error"

    if (statusCode === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          errorCode: "QUOTA_EXHAUSTED",
          message: "OpenAI rate limit exceeded. Please wait or check your billing.",
          shouldRotateKey: true,
        },
        { status: 429 },
      )
    }

    if (statusCode === 401) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          errorCode: "INVALID_KEY",
          message: "The OpenAI API key is invalid.",
          shouldRotateKey: true,
        },
        { status: statusCode },
      )
    }

    if (statusCode === 402) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          errorCode: "NO_CREDITS",
          message: "Your OpenAI account has insufficient credits. Please add billing.",
          shouldRotateKey: true,
        },
        { status: statusCode },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        errorCode: "API_ERROR",
        message: errorMessage,
      },
      { status: 500 },
    )
  }

  const openaiData = await openaiResponse.json()
  const textResponse = openaiData.choices?.[0]?.message?.content

  if (!textResponse) {
    return NextResponse.json(
      {
        error: "No response from OpenAI",
        errorCode: "EMPTY_RESPONSE",
        message: "The AI did not return a valid response.",
      },
      { status: 500 },
    )
  }

  return parseAndReturnMetadata(textResponse)
}

function parseAndReturnMetadata(textResponse: string) {
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json(
      {
        error: "Could not parse response",
        errorCode: "PARSE_ERROR",
        message: "Failed to parse the AI response.",
      },
      { status: 500 },
    )
  }

  try {
    const metadata = JSON.parse(jsonMatch[0])
    return NextResponse.json({
      title: metadata.title || "Untitled",
      description: metadata.description || "",
      keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
    })
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON response",
        errorCode: "JSON_ERROR",
        message: "The AI returned invalid JSON.",
      },
      { status: 500 },
    )
  }
}
