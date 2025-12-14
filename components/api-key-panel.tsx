"use client"

import { useState } from "react"
import type { ApiKeyInfo } from "@/types/ai-provider"

export function ApiKeyPanel({
  apiKeys,
  onApiKeysChange,
}: {
  apiKeys: ApiKeyInfo[]
  onApiKeysChange: (keys: ApiKeyInfo[]) => void
}) {
  const [key, setKey] = useState("")

  const addKey = () => {
    if (!key.trim()) return
    onApiKeysChange([
      ...apiKeys,
      {
        key,
        name: "Mistral API Key",
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
      <h3>Mistral API Key</h3>

      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter Mistral API Key"
      />

      <button onClick={addKey}>Add Key</button>

      <ul>
        {apiKeys.map((k, i) => (
          <li key={i}>{k.key.slice(0, 8)}...</li>
        ))}
      </ul>
    </div>
  )
}
