"use client"

import { useState, useCallback, useRef } from "react"
import { Header } from "./header"
import { FileUploader } from "./file-uploader"
import { SettingsPanel } from "./settings-panel"
import { ApiKeyPanel } from "./api-key-panel"
import { GeneratedMetadata } from "./generated-metadata"
import { HowToUse } from "./how-to-use"
import { Features } from "./features"
import { AboutDeveloper } from "./about-developer"
import { Footer } from "./footer"
import { ComparisonSection } from "./comparison-section"
import { SupportedSites } from "./supported-sites"
import { QuotaExhaustedBanner } from "./quota-exhausted-banner"
import type { FileWithPreview, GeneratedMeta, Settings, ApiKeyInfo, ProcessingStats, AIProvider } from "@/lib/types"
import { Sparkles, Zap, Shield, CheckCircle2, AlertCircle, RotateCcw, Pause, Play, Clock } from "lucide-react"

export function MetadataGenerator() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([])
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash")
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("gemini")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [generatedMetadata, setGeneratedMetadata] = useState<GeneratedMeta[]>([])
  const [requestDelay, setRequestDelay] = useState(1000)
  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    startTime: null,
    endTime: null,
  })
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null)
  const [quotaExhausted, setQuotaExhausted] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    titleLength: 100,
    keywordsCount: 40,
    descriptionLength: 150,
    keywordFormat: "mixed",
    includeKeywords: "",
    excludeKeywords: "",
    filenameAsTitle: false,
    silhouetteMode: false,
    filenameOnlyMode: false,
    pngBackground: "transparent",
    titlePrefix: "",
    titleSuffix: "",
    descriptionPrefix: "",
    descriptionSuffix: "",
  })
  const [showApiKeyPanel, setShowApiKeyPanel] = useState(false)

  const pauseRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFilesSelected = useCallback((newFiles: FileWithPreview[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 1000))
  }, [])

  const handleClearFiles = useCallback(() => {
    setFiles([])
    setGeneratedMetadata([])
    setProcessingStats({ total: 0, completed: 0, failed: 0, pending: 0, startTime: null, endTime: null })
    setRateLimitMessage(null)
    setQuotaExhausted(false)
  }, [])

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1])
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const processFile = async (
    file: FileWithPreview,
    allActiveKeys: ApiKeyInfo[],
    startKeyIndex: number,
  ): Promise<{ result: GeneratedMeta; usedKeyIndex: number }> => {
    const maxKeyAttempts = allActiveKeys.length
    let currentKeyIndex = startKeyIndex
    let lastError = "Unknown error"

    for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
      const keyInfo = allActiveKeys[currentKeyIndex]
      const actualKeyIndex = apiKeys.findIndex((k) => k.key === keyInfo.key)

      try {
        const base64 = await fileToBase64(file.file)

        const response = await fetch("/api/generate-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            filename: file.file.name,
            mimeType: file.file.type,
            apiKey: keyInfo.key,
            model: selectedModel,
            settings,
            provider: selectedProvider,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.shouldRotateKey && keyAttempt < maxKeyAttempts - 1) {
            setApiKeys((prev) => {
              const updated = [...prev]
              if (updated[actualKeyIndex]) {
                updated[actualKeyIndex].errors += 1
              }
              return updated
            })

            currentKeyIndex = (currentKeyIndex + 1) % allActiveKeys.length

            if (data.errorCode === "RATE_LIMIT" && data.retryAfter) {
              setRateLimitMessage(`Rate limited. Trying next API key...`)
              await new Promise((resolve) => setTimeout(resolve, 2000))
            }

            continue
          }

          lastError = data.message || data.error || "API request failed"

          if (data.errorCode === "QUOTA_EXHAUSTED") {
            setQuotaExhausted(true)
            setRateLimitMessage(
              selectedProvider === "gemini"
                ? "All Gemini API keys have exhausted their daily quota. Try switching to OpenAI or add new API keys."
                : "OpenAI rate limit exceeded. Check your billing or try Gemini API.",
            )
          }

          throw new Error(lastError)
        }

        setQuotaExhausted(false)

        setApiKeys((prev) => {
          const updated = [...prev]
          if (updated[actualKeyIndex]) {
            updated[actualKeyIndex].usageCount += 1
            updated[actualKeyIndex].lastUsed = new Date()
          }
          return updated
        })

        setRateLimitMessage(null)

        return {
          result: {
            filename: file.file.name,
            title: (settings.titlePrefix + data.title + settings.titleSuffix).slice(0, settings.titleLength),
            description: (settings.descriptionPrefix + data.description + settings.descriptionSuffix).slice(
              0,
              settings.descriptionLength,
            ),
            keywords: data.keywords.slice(0, settings.keywordsCount),
            status: "completed",
            processedAt: new Date(),
          },
          usedKeyIndex: currentKeyIndex,
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Unknown error"

        setApiKeys((prev) => {
          const updated = [...prev]
          if (updated[actualKeyIndex]) {
            updated[actualKeyIndex].errors += 1
          }
          return updated
        })

        if (keyAttempt === maxKeyAttempts - 1) {
          break
        }

        currentKeyIndex = (currentKeyIndex + 1) % allActiveKeys.length
      }
    }

    return {
      result: {
        filename: file.file.name,
        title: "Error generating metadata",
        description: lastError,
        keywords: [],
        status: "error",
        error: lastError,
      },
      usedKeyIndex: currentKeyIndex,
    }
  }

  const handleGenerate = async () => {
    const activeKeys = apiKeys.filter((k) => k.isActive && k.provider === selectedProvider)
    if (files.length === 0 || activeKeys.length === 0) return

    setIsGenerating(true)
    setIsPaused(false)
    setRateLimitMessage(null)
    pauseRef.current = false
    abortControllerRef.current = new AbortController()

    const initialMetadata: GeneratedMeta[] = files.map((f) => ({
      filename: f.file.name,
      title: "",
      description: "",
      keywords: [],
      status: "pending" as const,
    }))
    setGeneratedMetadata(initialMetadata)
    setProcessingStats({
      total: files.length,
      completed: 0,
      failed: 0,
      pending: files.length,
      startTime: new Date(),
      endTime: null,
    })

    const results: GeneratedMeta[] = [...initialMetadata]
    let completed = 0
    let failed = 0
    let currentKeyIndex = 0

    for (let i = 0; i < files.length; i++) {
      while (pauseRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const file = files[i]

      results[i] = { ...results[i], status: "processing" }
      setGeneratedMetadata([...results])

      const { result, usedKeyIndex } = await processFile(file, activeKeys, currentKeyIndex)
      results[i] = result

      currentKeyIndex = (usedKeyIndex + 1) % activeKeys.length

      if (result.status === "completed") {
        completed++
      } else {
        failed++
      }

      setGeneratedMetadata([...results])
      setProcessingStats({
        total: files.length,
        completed,
        failed,
        pending: files.length - completed - failed,
        startTime: processingStats.startTime,
        endTime: null,
      })

      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, requestDelay))
      }
    }

    setProcessingStats((prev) => ({
      ...prev,
      endTime: new Date(),
    }))
    setIsGenerating(false)
  }

  const handleRetryFailed = async () => {
    const activeKeys = apiKeys.filter((k) => k.isActive && k.provider === selectedProvider)
    if (activeKeys.length === 0) return

    const failedIndices = generatedMetadata.map((m, i) => (m.status === "error" ? i : -1)).filter((i) => i !== -1)

    if (failedIndices.length === 0) return

    setIsGenerating(true)
    setRateLimitMessage(null)
    let currentKeyIndex = 0

    for (let i = 0; i < failedIndices.length; i++) {
      const fileIndex = failedIndices[i]
      const file = files[fileIndex]

      setGeneratedMetadata((prev) => {
        const updated = [...prev]
        updated[fileIndex] = { ...updated[fileIndex], status: "processing" }
        return updated
      })

      const { result, usedKeyIndex } = await processFile(file, activeKeys, currentKeyIndex)
      currentKeyIndex = (usedKeyIndex + 1) % activeKeys.length

      setGeneratedMetadata((prev) => {
        const updated = [...prev]
        updated[fileIndex] = result
        return updated
      })

      setProcessingStats((prev) => ({
        ...prev,
        completed: result.status === "completed" ? prev.completed + 1 : prev.completed,
        failed: result.status === "error" ? prev.failed : prev.failed - 1,
      }))

      if (i < failedIndices.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, requestDelay))
      }
    }

    setIsGenerating(false)
  }

  const togglePause = () => {
    pauseRef.current = !pauseRef.current
    setIsPaused(!isPaused)
  }

  const progress =
    processingStats.total > 0
      ? Math.round(((processingStats.completed + processingStats.failed) / processingStats.total) * 100)
      : 0

  const activeKeysCount = apiKeys.filter((k) => k.isActive && k.provider === selectedProvider).length
  const failedCount = generatedMetadata.filter((m) => m.status === "error").length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              100% Free Forever - AI-Powered Metadata Generation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Professional AI Metadata
              <span className="block text-primary">Generator</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate SEO-optimized metadata for your stock photos and videos in seconds. Powered by{" "}
              <span className={selectedProvider === "gemini" ? "text-blue-500" : "text-emerald-500"}>
                {selectedProvider === "gemini" ? "Google Gemini" : "OpenAI GPT"}
              </span>{" "}
              AI for accurate, relevant results.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Gemini + OpenAI Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No Sign Up Required</span>
              </div>
            </div>
          </div>

          {quotaExhausted && (
            <QuotaExhaustedBanner
              onDismiss={() => setQuotaExhausted(false)}
              onAddNewKey={() => setShowApiKeyPanel(true)}
            />
          )}

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-primary/5 mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Generate Metadata Like A Pro</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose between Gemini (free) or OpenAI (paid) for best results
                </p>
              </div>
              <span className="px-4 py-1.5 bg-accent/10 text-accent-foreground text-sm font-semibold rounded-full border border-accent/20">
                Beta V 2.0
              </span>
            </div>

            <FileUploader
              files={files}
              onFilesSelected={handleFilesSelected}
              onClearFiles={handleClearFiles}
              onRemoveFile={handleRemoveFile}
              maxFiles={1000}
            />

            <div className="grid lg:grid-cols-3 gap-8 mt-10">
              <div className="lg:col-span-2">
                <SettingsPanel settings={settings} onSettingsChange={setSettings} />
              </div>
              <div>
                <ApiKeyPanel
                  apiKeys={apiKeys}
                  onApiKeysChange={setApiKeys}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                  quotaExhausted={quotaExhausted}
                  autoExpand={showApiKeyPanel}
                  onExpandChange={setShowApiKeyPanel}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Request Delay</p>
                    <p className="text-xs text-muted-foreground">Time between API requests to avoid rate limits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="500"
                    value={requestDelay}
                    onChange={(e) => setRequestDelay(Number(e.target.value))}
                    className="w-32 accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground w-16">{requestDelay / 1000}s</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={files.length === 0 || activeKeysCount === 0 || isGenerating}
                  className={`flex-1 py-4 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg text-white ${
                    selectedProvider === "gemini"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30"
                  }`}
                >
                  {isGenerating
                    ? `Processing with ${selectedProvider === "gemini" ? "Gemini" : "OpenAI"}...`
                    : activeKeysCount === 0
                      ? `Add ${selectedProvider === "gemini" ? "Gemini" : "OpenAI"} API Key to Start`
                      : `Generate with ${selectedProvider === "gemini" ? "Gemini" : "OpenAI"} (${activeKeysCount} Key${activeKeysCount > 1 ? "s" : ""})`}
                </button>

                {isGenerating && (
                  <button
                    onClick={togglePause}
                    className="px-6 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-all"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                )}

                {!isGenerating && failedCount > 0 && (
                  <button
                    onClick={handleRetryFailed}
                    className="px-6 py-4 bg-destructive/10 text-destructive font-semibold rounded-xl hover:bg-destructive/20 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retry ({failedCount})
                  </button>
                )}
              </div>

              {rateLimitMessage && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-700">{rateLimitMessage}</p>
                </div>
              )}

              {(isGenerating || processingStats.total > 0) && (
                <div className="mt-6 p-6 bg-secondary/50 rounded-2xl border border-border">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-secondary"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className={selectedProvider === "gemini" ? "text-blue-500" : "text-emerald-500"}
                            strokeDasharray={`${progress * 2.26} 226`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className={`text-xl font-bold ${selectedProvider === "gemini" ? "text-blue-500" : "text-emerald-500"}`}
                        >
                          {progress}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isGenerating ? (isPaused ? "Paused" : "Processing...") : "Completed"}
                        </p>
                        <p className="font-semibold text-foreground">
                          {processingStats.completed + processingStats.failed} / {processingStats.total} files
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 text-center">
                        <p className="text-2xl font-bold text-green-600">{processingStats.completed}</p>
                        <p className="text-xs text-green-600">Completed</p>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2 text-center">
                        <p className="text-2xl font-bold text-destructive">{processingStats.failed}</p>
                        <p className="text-xs text-destructive">Failed</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 text-center">
                        <p className="text-2xl font-bold text-blue-600">{processingStats.pending}</p>
                        <p className="text-xs text-blue-600">Pending</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedProvider === "gemini"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {generatedMetadata.length > 0 && (
            <GeneratedMetadata metadata={generatedMetadata} files={files} settings={settings} />
          )}

          <SupportedSites />
          <HowToUse />
          <ComparisonSection />
          <Features />
          <AboutDeveloper />
        </div>
      </main>

      <Footer />
    </div>
  )
}
