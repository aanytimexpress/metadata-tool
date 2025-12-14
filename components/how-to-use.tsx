import { Key, Upload, Settings, Sparkles, Download, Zap } from "lucide-react"

const steps = [
  {
    icon: Key,
    title: "Get API Access",
    description:
      "Visit Google AI Studio and create a free account to get your Gemini API key. It's completely free and takes just 2 minutes to set up.",
    step: "01",
  },
  {
    icon: Zap,
    title: "Enter API Key",
    description:
      "Copy your Gemini API key and paste it into the tool. Your key is stored securely in your browser and never shared.",
    step: "02",
  },
  {
    icon: Upload,
    title: "Upload Images",
    description: "Select your stock photos (JPG, PNG, SVG). Upload up to 1000 images at once for batch processing.",
    step: "03",
  },
  {
    icon: Settings,
    title: "Configure Settings",
    description:
      "Choose your preferred title length and keyword format. Customize settings to match your platform requirements.",
    step: "04",
  },
  {
    icon: Sparkles,
    title: "Generate Metadata",
    description:
      'Click "Generate" and watch AI analyze your images. Get professional titles, descriptions, and keywords in seconds.',
    step: "05",
  },
  {
    icon: Download,
    title: "Export & Upload",
    description:
      "Review, edit if needed, then export as CSV or copy individual metadata. Ready to upload to any stock platform instantly.",
    step: "06",
  },
]

export function HowToUse() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            How to Use
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Follow these simple steps to <span className="text-primary">Generate Metadata</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-4xl font-bold text-border group-hover:text-primary/20 transition-colors">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
