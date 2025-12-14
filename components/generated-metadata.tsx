"use client"

import type { GeneratedMeta, Settings } from "@/lib/types"
import { stockSites, generateCSVForSite, getCSVFilename, type StockSite } from "@/lib/csv-formats"
import { useState } from "react"
import { Copy, Check, Download, SettingsIcon, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface GeneratedMetadataProps {
  metadata: GeneratedMeta[]
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function GeneratedMetadata({ metadata, settings, onSettingsChange }: GeneratedMetadataProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showTitleSettings, setShowTitleSettings] = useState(false)
  const [selectedSites, setSelectedSites] = useState<StockSite[]>([])

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleSiteSelection = (siteId: StockSite) => {
    setSelectedSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
  }

  const selectAllSites = () => {
    setSelectedSites(stockSites.map((s) => s.id))
  }

  const deselectAllSites = () => {
    setSelectedSites([])
  }

  const exportSelectedCSVs = () => {
    if (selectedSites.length === 0) return

    // Only export completed metadata
    const completedMetadata = metadata.filter((m) => m.status === "completed")

    selectedSites.forEach((siteId) => {
      const csvContent = generateCSVForSite(siteId, completedMetadata, settings)
      const filename = getCSVFilename(siteId)

      const BOM = "\uFEFF"
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    })

    setShowExportModal(false)
    setSelectedSites([])
  }

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "processing":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  const completedCount = metadata.filter((m) => m.status === "completed").length
  const errorCount = metadata.filter((m) => m.status === "error").length

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Generated Metadata</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} completed, {errorCount} failed, {metadata.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTitleSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            Prefix/Suffix
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            disabled={completedCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {metadata.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 transition-all ${
              item.status === "error"
                ? "bg-destructive/5 border border-destructive/20"
                : item.status === "completed"
                  ? "bg-secondary/30 border border-border"
                  : item.status === "processing"
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-secondary/10 border border-border/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon(item.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground truncate max-w-[300px]">{item.filename}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-500/20 text-green-600"
                        : item.status === "error"
                          ? "bg-destructive/20 text-destructive"
                          : item.status === "processing"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status || "pending"}
                  </span>
                </div>

                {item.status === "completed" && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Title</span>
                        <button
                          onClick={() => copyToClipboard(item.title, index * 3)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          {copiedIndex === index * 3 ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-foreground">{item.title}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Description</span>
                        <button
                          onClick={() => copyToClipboard(item.description, index * 3 + 1)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          {copiedIndex === index * 3 + 1 ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-foreground">{item.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase">
                          Keywords ({item.keywords.length})
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.keywords.join(", "), index * 3 + 2)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          {copiedIndex === index * 3 + 2 ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.keywords.slice(0, 15).map((keyword, kIndex) => (
                          <span key={kIndex} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-lg">
                            {keyword}
                          </span>
                        ))}
                        {item.keywords.length > 15 && (
                          <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-lg">
                            +{item.keywords.length - 15} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {item.status === "error" && (
                  <p className="text-sm text-destructive">{item.error || "Failed to generate metadata"}</p>
                )}

                {item.status === "processing" && <p className="text-sm text-muted-foreground">Analyzing image...</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-foreground">Export to Stock Sites</h3>
              <button onClick={() => setShowExportModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Exporting {completedCount} successfully generated metadata. Each site has its own CSV format.
            </p>

            <div className="flex gap-2 mb-4">
              <button onClick={selectAllSites} className="text-sm text-primary hover:underline">
                Select All
              </button>
              <span className="text-muted-foreground">|</span>
              <button onClick={deselectAllSites} className="text-sm text-primary hover:underline">
                Deselect All
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {stockSites.map((site) => (
                <label
                  key={site.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSites.includes(site.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site.id)}
                    onChange={() => toggleSiteSelection(site.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: site.color }} />
                    <span className="font-medium text-foreground text-sm">{site.name}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={exportSelectedCSVs}
                disabled={selectedSites.length === 0}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
              >
                Export{" "}
                {selectedSites.length > 0 ? `${selectedSites.length} CSV${selectedSites.length > 1 ? "s" : ""}` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Settings Modal */}
      {showTitleSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-foreground">Title & Description Prefix/Suffix</h3>
              <button
                onClick={() => setShowTitleSettings(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Title Prefix</label>
                <input
                  type="text"
                  value={settings.titlePrefix}
                  onChange={(e) => updateSetting("titlePrefix", e.target.value)}
                  placeholder="e.g., Premium "
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Title Suffix</label>
                <input
                  type="text"
                  value={settings.titleSuffix}
                  onChange={(e) => updateSetting("titleSuffix", e.target.value)}
                  placeholder="e.g., - Stock Photo"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description Prefix</label>
                <input
                  type="text"
                  value={settings.descriptionPrefix}
                  onChange={(e) => updateSetting("descriptionPrefix", e.target.value)}
                  placeholder="e.g., High-quality "
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description Suffix</label>
                <input
                  type="text"
                  value={settings.descriptionSuffix}
                  onChange={(e) => updateSetting("descriptionSuffix", e.target.value)}
                  placeholder="e.g., Perfect for commercial use."
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground"
                />
              </div>
            </div>

            <button
              onClick={() => setShowTitleSettings(false)}
              className="w-full mt-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
