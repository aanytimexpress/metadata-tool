"use client"

import { useState } from "react"
import type { AIProvider } from "@/types/ai-provider"

export interface ApiKeyInfo {
  key: string
  name: string
  provider: AIProvider
}

interface Props {
  apiKeys: ApiKeyInfo[]
  onChange: (keys: ApiKeyInfo[]) => void
  provider: AIProvider
  onProviderChange: (p: AIProvider) => void
}

export function ApiKeyPanel({ apiKeys, onChange, provider, onProviderChange }: Props) {
  const [value, setValue] = useState("")

  function addKey() {
    if (!value) return
    onChange([
      ...apiKeys,
      {
        key: value,
        name: `${provider.toUpperCase()} Key`,
        provider,
      },
    ])
    setValue("")
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => onProviderChange("gemini")}>Gemini</button>
        <button onClick={() => onProviderChange("mistral")}>Mistral</button>
      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${provider} API key`}
      />

      <button onClick={addKey}>Add Key</button>

      <ul>
        {apiKeys.map((k, i) => (
          <li key={i}>{k.name}</li>
        ))}
      </ul>
    </div>
  )
}
