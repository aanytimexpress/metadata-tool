import { Check, X, Sparkles, Crown } from "lucide-react"

export function ComparisonSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            The Smart Choice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why choose <span className="text-primary">MetadataGen</span>?
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 max-w-4xl mx-auto">
          {/* Other Tools */}
          <div className="flex-1 bg-card border border-border rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Other Tools</h3>
              <p className="text-4xl font-bold text-foreground">
                $10-50<span className="text-lg text-muted-foreground font-normal">/month</span>
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Monthly subscription fees
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Limited file uploads (50-100)
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Basic AI models
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Limited export options
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                Watermarked results
              </li>
            </ul>
          </div>

          {/* VS Badge */}
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-secondary border-4 border-background flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-muted-foreground">VS</span>
            </div>
          </div>

          {/* MetadataGen */}
          <div className="flex-1 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-8 shadow-xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                RECOMMENDED
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-semibold">MetadataGen</h3>
              </div>
              <p className="text-4xl font-bold">100% FREE</p>
              <p className="text-sm opacity-80">Forever, no credit card needed</p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                No subscription required
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                Up to 1000 files per batch
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                Latest Gemini AI models
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                6 platform CSV exports
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                100% privacy - local processing
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-12 max-w-2xl mx-auto">
          Save hundreds of dollars annually while getting superior AI-powered metadata generation. Join thousands of
          microstockers who've made the smart switch to MetadataGen.
        </p>
      </div>
    </section>
  )
}
