"use client"

import { AlertTriangle, Key, Clock, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuotaExhaustedBannerProps {
  onDismiss: () => void
  onAddNewKey: () => void
}

export function QuotaExhaustedBanner({ onDismiss, onAddNewKey }: QuotaExhaustedBannerProps) {
  return (
    <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-orange-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-500/20 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">API Quota Exhausted</h3>
          <p className="text-muted-foreground mb-4">
            All your Gemini API keys have reached their daily quota limit. The free tier allows limited requests per
            day.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
              <Key className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Add New API Key</p>
                <p className="text-xs text-muted-foreground">Get a new key from a different Google account</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Wait 24 Hours</p>
                <p className="text-xs text-muted-foreground">Quota resets daily at midnight PT</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
              <ExternalLink className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Upgrade to Paid</p>
                <p className="text-xs text-muted-foreground">Get higher limits with Google AI paid tier</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onAddNewKey} className="bg-teal-600 hover:bg-teal-700">
              <Key className="w-4 h-4 mr-2" />
              Add New API Key
            </Button>
            <Button variant="outline" asChild>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Free API Key
              </a>
            </Button>
            <Button variant="ghost" onClick={onDismiss}>
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
