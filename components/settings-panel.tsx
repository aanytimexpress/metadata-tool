"use client"

import type { Settings } from "@/lib/types"
import { useState } from "react"
import { Settings2, X, Sliders, Type, Hash, FileText } from "lucide-react"

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [showAdditional, setShowAdditional] = useState(false)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Essential Settings</h3>
            <p className="text-sm text-muted-foreground">Core metadata generation parameters</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="w-4 h-4 text-muted-foreground" />
              Title Length
            </label>
            <input
              type="number"
              value={settings.titleLength}
              onChange={(e) => updateSetting("titleLength", Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-muted-foreground">{settings.titleLength} characters max</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Hash className="w-4 h-4 text-muted-foreground" />
              Keywords Count
            </label>
            <input
              type="number"
              value={settings.keywordsCount}
              onChange={(e) => updateSetting("keywordsCount", Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-muted-foreground">{settings.keywordsCount} keywords max</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description Length
            </label>
            <input
              type="number"
              value={settings.descriptionLength}
              onChange={(e) => updateSetting("descriptionLength", Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-muted-foreground">{settings.descriptionLength} characters max</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
            <Sliders className="w-4 h-4 text-muted-foreground" />
            Keyword Format
          </label>
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
            {(["single", "double", "mixed"] as const).map((format) => (
              <button
                key={format}
                onClick={() => updateSetting("keywordFormat", format)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  settings.keywordFormat === format
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {format === "single" ? "Single Only" : format === "double" ? "Double Only" : "Mixed"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Include Keywords</label>
            <input
              type="text"
              value={settings.includeKeywords}
              onChange={(e) => updateSetting("includeKeywords", e.target.value)}
              placeholder="keyword1, keyword2..."
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Exclude Keywords</label>
            <input
              type="text"
              value={settings.excludeKeywords}
              onChange={(e) => updateSetting("excludeKeywords", e.target.value)}
              placeholder="keyword1, keyword2..."
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAdditional(true)}
          className="mt-6 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Additional Settings
        </button>
      </div>

      {/* Additional Settings Modal */}
      {showAdditional && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Additional Settings</h3>
              </div>
              <button
                onClick={() => setShowAdditional(false)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <label className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.filenameAsTitle}
                  onChange={(e) => updateSetting("filenameAsTitle", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-foreground">Filename as Title</p>
                  <p className="text-sm text-muted-foreground">
                    Uses the filename (without extension) as the title instead of generating one.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.silhouetteMode}
                  onChange={(e) => updateSetting("silhouetteMode", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-foreground">Silhouette Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Processes SVG files to show only outlines/shapes for silhouette-style metadata.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.filenameOnlyMode}
                  onChange={(e) => updateSetting("filenameOnlyMode", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-foreground">Filename-Only Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Generates metadata based only on the filename without analyzing the actual image.
                  </p>
                </div>
              </label>

              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="font-medium text-foreground mb-2">PNG Background</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Set background color for PNG images with transparency.
                </p>
                <div className="flex gap-2">
                  {[
                    { value: "white", label: "White", bg: "bg-white" },
                    { value: "black", label: "Black", bg: "bg-black" },
                    { value: "transparent", label: "Transparent", bg: "bg-gradient-to-br from-gray-200 to-gray-400" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSetting("pngBackground", option.value as "white" | "black" | "transparent")}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        settings.pngBackground === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <span className={`w-4 h-4 ${option.bg} border border-border rounded`} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAdditional(false)}
              className="w-full mt-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
