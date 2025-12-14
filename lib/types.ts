export interface FileWithPreview {
  file: File
  preview: string
  id: string
}

export interface GeneratedMeta {
  filename: string
  title: string
  description: string
  keywords: string[]
  status?: "pending" | "processing" | "completed" | "error"
  error?: string
  processedAt?: Date
}

export interface Settings {
  titleLength: number
  keywordsCount: number
  descriptionLength: number
  keywordFormat: "single" | "double" | "mixed"
  includeKeywords: string
  excludeKeywords: string
  filenameAsTitle: boolean
  silhouetteMode: boolean
  filenameOnlyMode: boolean
  pngBackground: "white" | "black" | "transparent"
  titlePrefix: string
  titleSuffix: string
  descriptionPrefix: string
  descriptionSuffix: string
}

export interface ApiKeyInfo {
  key: string
  name: string
  usageCount: number
  lastUsed?: Date
  errors: number
  isActive: boolean
  provider: "gemini" | "openai"
}

export interface ProcessingStats {
  total: number
  completed: number
  failed: number
  pending: number
  startTime?: Date
  endTime?: Date
}

export type AIProvider = "gemini" | "openai"

export interface AIModel {
  id: string
  name: string
  speed: string
  provider: AIProvider
}
