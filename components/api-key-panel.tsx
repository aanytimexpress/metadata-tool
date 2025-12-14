"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Key,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Check,
  Trash2,
  RotateCcw,
  Zap,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react"
import type { ApiKeyInfo, AIProvider, AIModel } from "@/lib/types"

interface ApiKeyPanelProps {
  apiKeys: ApiKeyInfo[]
  onApiKeysChange: (keys: ApiKeyInfo[]) => void
  selectedModel: string
  onModelChange: (model: string) => void
  selectedProvider: AIProvider
  onProviderChange: (provider: AIProvider) => void
  quotaExhausted?: boolean
  autoExpand?: boolean
  onExpandChange?: (expanded: boolean) => void
}

const MODELS: AIModel[] = [
  // Gemini Models
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite", speed: "Fastest", provider: "gemini" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", speed: "Fast", provider: "gemini" },
  { id: "gemini-2.5-flash-lite-preview", name: "Gemini 2.5 Flash Lite", speed: "Fast", provider: "gemini" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", speed: "Standard", provider: "gemini" },
  // OpenAI Models
  { id: "gpt-4o-mini", name: "GPT-4o Mini", speed: "Fastest", provider: "openai" },
  { id: "gpt-4o", name: "GPT-4o", speed: "Fast", provider: "openai" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", speed: "Standard", provider: "openai" },
]

export function ApiKeyPanel({
  apiKeys,
  onApiKeysChange,
  selectedModel,
  onModelChange,
  selectedProvider,
  onProviderChange,
  quotaExhausted,
  autoExpand,
  onExpandChange,
}: ApiKeyPanelProps) {
  const [newKey, setNewKey] = useState("")
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyProvider, setNewKeyProvider] = useState<AIProvider>("gemini")
  const [showInput, setShowInput] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  useEffect(() => {
    if (autoExpand) {
      setShowInput(true)
      onExpandChange?.(false)
    }
  }, [autoExpand, onExpandChange])

  // Filter models by selected provider
  const filteredModels = MODELS.filter((m) => m.provider === selectedProvider)

  // Filter keys by selected provider
  const providerKeys = apiKeys.filter((k) => k.provider === selectedProvider)

  const addKey = () => {
    if (newKey.trim() && apiKeys.length < 10) {
      onApiKeysChange([
        ...apiKeys,
        {
          key: newKey.trim(),
          name:
            newKeyName.trim() || `${newKeyProvider === "openai" ? "OpenAI" : "Gemini"} Key ${providerKeys.length + 1}`,
          usageCount: 0,
          errors: 0,
          isActive: true,
          provider: newKeyProvider,
        },
      ])
      setNewKey("")
      setNewKeyName("")
      setShowInput(false)
    }
  }

  const removeKey = (index: number) => {
    onApiKeysChange(apiKeys.filter((_, i) => i !== index))
  }

  const toggleKeyActive = (index: number) => {
    const updated = [...apiKeys]
    updated[index].isActive = !updated[index].isActive
    onApiKeysChange(updated)
  }

  const startEditName = (index: number) => {
    setEditingIndex(index)
    setEditName(apiKeys[index].name)
  }

  const saveEditName = (index: number) => {
    const updated = [...apiKeys]
    updated[index].name = editName.trim() || `API Key ${index + 1}`
    onApiKeysChange(updated)
    setEditingIndex(null)
    setEditName("")
  }

  const resetKeyStats = (index: number) => {
    const updated = [...apiKeys]
    updated[index].usageCount = 0
    updated[index].errors = 0
    onApiKeysChange(updated)
  }

  const activeKeysCount = providerKeys.filter((k) => k.isActive).length
  const totalUsage = providerKeys.reduce((sum, k) => sum + k.usageCount, 0)

  // Get original index in apiKeys array
  const getOriginalIndex = (providerKeyIndex: number) => {
    let count = 0
    for (let i = 0; i < apiKeys.length; i++) {
      if (apiKeys[i].provider === selectedProvider) {
        if (count === providerKeyIndex) return i
        count++
      }
    }
    return -1
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Multi-API Key Manager</h3>
          <p className="text-xs text-muted-foreground">Gemini or OpenAI - Choose your AI</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => {
            onProviderChange("gemini")
            // Select first Gemini model if switching
            const firstGeminiModel = MODELS.find((m) => m.provider === "gemini")
            if (firstGeminiModel) onModelChange(firstGeminiModel.id)
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            selectedProvider === "gemini"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Gemini
        </button>
        <button
          onClick={() => {
            onProviderChange("openai")
            // Select first OpenAI model if switching
            const firstOpenAIModel = MODELS.find((m) => m.provider === "openai")
            if (firstOpenAIModel) onModelChange(firstOpenAIModel.id)
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            selectedProvider === "openai"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Zap className="w-4 h-4" />
          OpenAI
        </button>
      </div>

      {/* Quota Exhausted Warning Banner */}
      {quotaExhausted && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Daily Quota Exhausted</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {selectedProvider === "gemini"
              ? "All your Gemini API keys have exhausted their free tier daily quota."
              : "OpenAI API quota exceeded. Check your billing."}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Wait for quota reset or switch to {selectedProvider === "gemini" ? "OpenAI" : "Gemini"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plus className="w-4 h-4" />
              <span>Or add new API keys from different accounts</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{providerKeys.length}/5</p>
          <p className="text-xs text-muted-foreground">Keys Added</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{activeKeysCount}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{totalUsage}</p>
          <p className="text-xs text-muted-foreground">Total Used</p>
        </div>
      </div>

      {providerKeys.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              No {selectedProvider === "gemini" ? "Gemini" : "OpenAI"} API key added
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Add at least one {selectedProvider === "gemini" ? "Gemini" : "OpenAI"} API key to start generating metadata
          </p>
        </div>
      )}

      {/* API Keys List - filtered by provider */}
      <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
        {providerKeys.map((keyInfo, providerKeyIndex) => {
          const originalIndex = getOriginalIndex(providerKeyIndex)
          return (
            <div
              key={originalIndex}
              className={`bg-secondary/30 border rounded-xl p-3 transition-all ${
                keyInfo.isActive ? "border-primary/30" : "border-border opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {editingIndex === originalIndex ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEditName(originalIndex)}
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${keyInfo.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    <span className="text-sm font-medium text-foreground">{keyInfo.name}</span>
                    <button
                      onClick={() => startEditName(originalIndex)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => resetKeyStats(originalIndex)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                    title="Reset stats"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleKeyActive(originalIndex)}
                    className={`p-1.5 rounded-lg ${
                      keyInfo.isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary"
                    }`}
                    title={keyInfo.isActive ? "Disable" : "Enable"}
                  >
                    <Zap className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeKey(originalIndex)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  {keyInfo.key.slice(0, 8)}...{keyInfo.key.slice(-4)}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">
                    Used: <span className="text-foreground font-medium">{keyInfo.usageCount}</span>
                  </span>
                  {keyInfo.errors > 0 && (
                    <span className="text-destructive">
                      Errors: <span className="font-medium">{keyInfo.errors}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Key Form */}
      {showInput ? (
        <div className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setNewKeyProvider("gemini")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                newKeyProvider === "gemini" ? "bg-blue-500 text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              Gemini
            </button>
            <button
              onClick={() => setNewKeyProvider("openai")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                newKeyProvider === "openai" ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              OpenAI
            </button>
          </div>
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (optional)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
          />
          <input
            type="password"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder={`Enter ${newKeyProvider === "gemini" ? "Gemini" : "OpenAI"} API Key`}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <button
              onClick={addKey}
              disabled={!newKey.trim()}
              className={`flex-1 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${
                newKeyProvider === "gemini" ? "bg-blue-500" : "bg-emerald-500"
              }`}
            >
              Add Key
            </button>
            <button
              onClick={() => {
                setShowInput(false)
                setNewKey("")
                setNewKeyName("")
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          disabled={apiKeys.length >= 10}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {providerKeys.length === 0 ? "Add Your First API Key" : "Add Another Key"}
        </button>
      )}

      {/* Get API Key Links */}
      <div className="mt-4 flex flex-col gap-2">
        {selectedProvider === "gemini" ? (
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            Get Free Gemini API Key <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-emerald-500 hover:underline"
          >
            Get OpenAI API Key <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Model Selection */}
      <div className="mt-6 pt-6 border-t border-border">
        <label className="text-sm font-medium text-foreground block mb-3">
          {selectedProvider === "gemini" ? "Gemini" : "OpenAI"} Model
        </label>
        <div className="space-y-2">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                selectedModel === model.id
                  ? selectedProvider === "gemini"
                    ? "bg-blue-500/10 border-2 border-blue-500"
                    : "bg-emerald-500/10 border-2 border-emerald-500"
                  : "bg-secondary/30 border-2 border-transparent hover:border-border"
              }`}
            >
              <span className="text-sm font-medium text-foreground">{model.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  model.speed === "Fastest"
                    ? "bg-green-500/20 text-green-600"
                    : model.speed === "Fast"
                      ? "bg-blue-500/20 text-blue-600"
                      : "bg-gray-500/20 text-gray-600"
                }`}
              >
                {model.speed}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {selectedProvider === "gemini"
            ? "Gemini offers free tier with daily limits"
            : "OpenAI requires paid credits but has higher limits"}
        </p>
      </div>
    </div>
  )
}
