"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import type { FileWithPreview } from "@/lib/types"
import { X, ImageIcon, Film, FileCode, CloudUpload } from "lucide-react"

interface FileUploaderProps {
  files: FileWithPreview[]
  onFilesSelected: (files: FileWithPreview[]) => void
  onClearFiles: () => void
  onRemoveFile: (index: number) => void
  maxFiles: number
}

export function FileUploader({ files, onFilesSelected, onClearFiles, onRemoveFile, maxFiles }: FileUploaderProps) {
  const [activeTab, setActiveTab] = useState<"videos" | "images" | "svgs">("videos")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileWithPreview[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }))
      onFilesSelected(newFiles)
    },
    [onFilesSelected],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/x-msvideo": [".avi"],
    },
    maxFiles: maxFiles - files.length,
  })

  const imageFiles = files.filter((f) => f.file.type.startsWith("image/") && !f.file.type.includes("svg"))
  const videoFiles = files.filter((f) => f.file.type.startsWith("video/"))
  const svgFiles = files.filter((f) => f.file.type.includes("svg"))

  const getDisplayFiles = () => {
    switch (activeTab) {
      case "images":
        return imageFiles
      case "videos":
        return videoFiles
      case "svgs":
        return svgFiles
      default:
        return files
    }
  }

  const tabs = [
    { id: "videos" as const, label: "Videos", icon: Film, count: videoFiles.length },
    { id: "images" as const, label: "Images", icon: ImageIcon, count: imageFiles.length },
    { id: "svgs" as const, label: "SVGs", icon: FileCode, count: svgFiles.length },
  ]

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <CloudUpload className="w-10 h-10 text-primary" />
        </div>
        <p className="text-xl font-semibold text-foreground mb-2">Drop your files here</p>
        <p className="text-muted-foreground mb-6">or click to browse from your device</p>
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
          Browse Files
        </button>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{files.length}</p>
            <p className="text-xs text-muted-foreground">Uploaded</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{maxFiles - files.length}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{maxFiles}</p>
            <p className="text-xs text-muted-foreground">Max Limit</p>
          </div>
        </div>
      </div>

      {/* Tabs - Videos First */}
      <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* File Grid */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Uploaded Files</h3>
          {files.length > 0 && (
            <button
              onClick={onClearFiles}
              className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {getDisplayFiles().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              {activeTab === "videos" ? (
                <Film className="w-8 h-8 text-muted-foreground" />
              ) : activeTab === "images" ? (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              ) : (
                <FileCode className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground">No {activeTab} uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-56 overflow-y-auto p-1">
            {getDisplayFiles().map((file) => (
              <div key={file.id} className="relative group aspect-square">
                {file.file.type.startsWith("video/") ? (
                  <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center">
                    <Film className="w-6 h-6 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.file.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
                <button
                  onClick={() => onRemoveFile(files.indexOf(file))}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg hover:scale-110"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-foreground bg-background/90 backdrop-blur-sm rounded px-1 py-0.5 truncate">
                    {file.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
