"use client"

import type { ApiKeyInfo, AIProvider, AIModel } from "@/types/ai-provider"
import { useState } from "react"

const MODELS: AIModel[] = [
  // MISTRAL
  { id: "mistral-small", name: "Mistral Small", speed: "Fastest", provider: "mistral" },
  { id: "mistral-medium", name: "Mistral Medium", speed: "Fast", provider: "mistral" },
  { id: "mistral-large", name: "Mistral Large", speed: "Standard", provider: "mistral" },
]

export function ApiKeyPanel({
  apiKeys,
  onApiKeysChange,
  selectedProvider,
  onProviderChange,
}: {
  apiKeys: ApiKeyInfo[]
  onApiKeysChange: (k: ApiKeyInfo[]) => void
  selectedProvider: AIProvider
  onProviderChange: (p: AIProvider) => void
}) {
  const [key, setKey] = useState("")

  const addKey = () => {
    if (!key) return
    onApiKeysChange([
      ...apiKeys,
      {
        key,
        name: "Mistral Key",
        provider: "mistral",
        isActive: true,
        usageCount: 0,
        errors: 0,
      },
    ])
    setKey("")
  }

  return (
    <div>
      <button onClick={() => onProviderChange("mistral")}>
        Mistral AI
      </button>

      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter Mistral API Key"
      />

      <button onClick={addKey}>Add Key</button>

      <ul>
        {apiKeys.map((k, i) => (
          <li key={i}>{k.key.slice(0, 6)}...</li>
        ))}
      </ul>
    </div>
  )
}
