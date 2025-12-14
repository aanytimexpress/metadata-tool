export type AIProvider = "gemini" | "openai" | "mistral"

export interface ApiKeyInfo {
  key: string
  name: string
  provider: AIProvider
  isActive: boolean
  usageCount: number
  errors: number
}

export interface AIModel {
  id: string
  name: string
  speed: "Fastest" | "Fast" | "Standard"
  provider: AIProvider
}
