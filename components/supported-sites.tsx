"use client"

import { FileDown, CheckCircle } from "lucide-react"

const stockSites = [
  {
    name: "Shutterstock",
    color: "#EE2B24",
    columns: ["Filename", "Description", "Keywords", "Categories", "Mature content", "Editorial"],
  },
  {
    name: "Adobe Stock",
    color: "#FF0000",
    columns: ["Filename", "Title", "Keywords", "Category"],
  },
  {
    name: "iStock by Getty Images",
    color: "#000000",
    columns: ["Filename", "Title", "Description", "Keywords", "Brief Code", "Country", "Created Date"],
  },
  {
    name: "Depositphotos",
    color: "#00B87A",
    columns: ["filename", "title", "description", "keywords"],
  },
  {
    name: "Dreamstime",
    color: "#7AC142",
    columns: ["Filename", "Title", "Description", "Keywords", "Categories", "MR ID", "Submission Type"],
  },
  {
    name: "123RF",
    color: "#009EE2",
    columns: ["oldfilename", "123rf_filename", "description", "keywords", "country"],
  },
]

export function SupportedSites() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <FileDown className="w-4 h-4" />
            CSV Export Support
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Supported Stock Platforms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Export your generated metadata directly to CSV files formatted specifically for each major stock photography
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stockSites.map((site) => (
            <div
              key={site.name}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: site.color }}
                >
                  {site.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{site.name}</h3>
                  <p className="text-xs text-muted-foreground">{site.columns.length} columns</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CSV Columns:</p>
                <div className="flex flex-wrap gap-1.5">
                  {site.columns.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Ready for export
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
