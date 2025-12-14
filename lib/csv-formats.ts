import type { GeneratedMeta, Settings } from "./types"

// Stock site types
export type StockSite = "shutterstock" | "adobe-stock" | "istock" | "depositphotos" | "dreamstime" | "123rf"

export interface StockSiteInfo {
  id: StockSite
  name: string
  description: string
  color: string
}

export const stockSites: StockSiteInfo[] = [
  {
    id: "shutterstock",
    name: "Shutterstock",
    description: "Filename, Description, Keywords, Categories, Mature content, Editorial",
    color: "#EE2B24",
  },
  {
    id: "adobe-stock",
    name: "Adobe Stock",
    description: "Filename, Title, Keywords, Category, Releases",
    color: "#FF0000",
  },
  {
    id: "istock",
    name: "iStock by Getty Images",
    description: "Filename, Title, Description, Keywords",
    color: "#000000",
  },
  {
    id: "depositphotos",
    name: "Depositphotos",
    description: "Filename, Title, Description, Keywords",
    color: "#00B87A",
  },
  {
    id: "dreamstime",
    name: "Dreamstime",
    description: "Filename, Title, Description, Keywords, Categories",
    color: "#7AC142",
  },
  {
    id: "123rf",
    name: "123RF",
    description: "oldfilename, 123rf_filename, description, keywords, country",
    color: "#009EE2",
  },
]

// Helper function to escape CSV values properly
function escapeCSV(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// Generate CSV for Shutterstock
// Format: Filename, Description, Keywords, Categories, Mature content, Editorial
export function generateShutterstockCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = ["Filename", "Description", "Keywords", "Categories", "Mature content", "Editorial"]

  const rows = metadata.map((m) => {
    const description = `${settings.descriptionPrefix}${m.description}${settings.descriptionSuffix}`
    const keywords = m.keywords.join(",")

    return [
      escapeCSV(m.filename),
      escapeCSV(description),
      escapeCSV(keywords),
      "", // Categories - left blank for user to fill from Shutterstock's accepted list
      "No", // Mature content - default No
      "No", // Editorial - default No
    ]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Generate CSV for Adobe Stock
// Format: Filename, Title, Keywords, Category, Releases
export function generateAdobeStockCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = ["Filename", "Title", "Keywords", "Category", "Releases"]

  const rows = metadata.map((m) => {
    const title = `${settings.titlePrefix}${m.title}${settings.titleSuffix}`.substring(0, 70) // Max 70 chars
    const keywords = m.keywords.slice(0, 50).join(",") // Max 50 keywords

    return [
      escapeCSV(m.filename.substring(0, 30)), // Max 30 chars for filename
      escapeCSV(title.replace(/,/g, "")), // No commas in title
      escapeCSV(keywords),
      "", // Category number - left blank for user to fill
      "", // Releases - left blank for user to fill
    ]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Generate CSV for iStock by Getty Images
// Format: Filename, Title, Description, Keywords
export function generateiStockCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = ["Filename", "Title", "Description", "Keywords"]

  const rows = metadata.map((m) => {
    const title = `${settings.titlePrefix}${m.title}${settings.titleSuffix}`
    const description = `${settings.descriptionPrefix}${m.description}${settings.descriptionSuffix}`
    const keywords = m.keywords.join(",")

    return [escapeCSV(m.filename), escapeCSV(title), escapeCSV(description), escapeCSV(keywords)]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Generate CSV for Depositphotos
// Format: filename, title, description, keywords
export function generateDepositphotosCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = ["filename", "title", "description", "keywords"]

  const rows = metadata.map((m) => {
    const title = `${settings.titlePrefix}${m.title}${settings.titleSuffix}`
    const description = `${settings.descriptionPrefix}${m.description}${settings.descriptionSuffix}`
    const keywords = m.keywords.join(",")

    return [escapeCSV(m.filename), escapeCSV(title), escapeCSV(description), escapeCSV(keywords)]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Generate CSV for Dreamstime
// Format: filename, title, description, keywords, main_category, secondary_category, W-EL, P-EL, SR-EL, MR, submission
export function generateDreamstimeCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = [
    "filename",
    "title",
    "description",
    "keywords",
    "main_category",
    "secondary_category",
    "W-EL",
    "P-EL",
    "SR-EL",
    "MR",
    "submission",
  ]

  const rows = metadata.map((m) => {
    const title = `${settings.titlePrefix}${m.title}${settings.titleSuffix}`
    const description = `${settings.descriptionPrefix}${m.description}${settings.descriptionSuffix}`
    const keywords = m.keywords.join(",")

    return [
      escapeCSV(m.filename),
      escapeCSV(title),
      escapeCSV(description),
      escapeCSV(keywords),
      "", // main_category
      "", // secondary_category
      "1", // W-EL (Web Extended License) - enabled by default
      "1", // P-EL (Print Extended License) - enabled by default
      "1", // SR-EL (Sell the Rights Extended License) - enabled by default
      "", // MR (Model Release ID)
      "1", // submission type: 1 = RF (Royalty Free)
    ]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Generate CSV for 123RF
// Format: oldfilename, 123rf_filename, description, keywords, country
export function generate123RFCSV(metadata: GeneratedMeta[], settings: Settings): string {
  const headers = ["oldfilename", "123rf_filename", "description", "keywords", "country"]

  const rows = metadata.map((m) => {
    const description = `${settings.descriptionPrefix}${m.description}${settings.descriptionSuffix}`
    const keywords = m.keywords.join(",")

    return [
      escapeCSV(m.filename), // oldfilename - original filename
      escapeCSV(m.filename), // 123rf_filename - same as original by default
      escapeCSV(description),
      escapeCSV(keywords),
      "", // country - left blank for user to fill
    ]
  })

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Main export function that routes to correct format
export function generateCSVForSite(site: StockSite, metadata: GeneratedMeta[], settings: Settings): string {
  switch (site) {
    case "shutterstock":
      return generateShutterstockCSV(metadata, settings)
    case "adobe-stock":
      return generateAdobeStockCSV(metadata, settings)
    case "istock":
      return generateiStockCSV(metadata, settings)
    case "depositphotos":
      return generateDepositphotosCSV(metadata, settings)
    case "dreamstime":
      return generateDreamstimeCSV(metadata, settings)
    case "123rf":
      return generate123RFCSV(metadata, settings)
    default:
      return generateShutterstockCSV(metadata, settings)
  }
}

// Get filename for download
export function getCSVFilename(site: StockSite): string {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "_")
  return `metadata_${site}_${date}.csv`
}
