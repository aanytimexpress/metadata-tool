import { Layers, Settings, Brain, FileSpreadsheet, Copy, TrendingUp, Sparkles } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Batch Image Processing",
    description:
      "Upload and process up to 1000 images simultaneously. Support for JPG, PNG, SVG, WebP, and video formats with intelligent file size optimization.",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Settings,
    title: "Customizable Settings",
    description:
      "Fine-tune your metadata generation with adjustable title lengths, keyword formats (single, double, mixed), and platform-specific optimization.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: Brain,
    title: "Advanced Image Analysis",
    description:
      "Deep learning algorithms analyze composition, colors, objects, emotions, and artistic style to generate contextually relevant metadata.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: FileSpreadsheet,
    title: "Multi-Platform CSV Export",
    description:
      "Export metadata in CSV format compatible with Shutterstock, Adobe Stock, iStock, Depositphotos, Dreamstime, and 123RF.",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description:
      "Instantly copy individual titles, keywords, or complete metadata sets to your clipboard. Perfect for quick uploads.",
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: TrendingUp,
    title: "Smart Keyword Optimization",
    description:
      "AI-powered keyword ranking and optimization based on search trends. Automatically prioritizes high-performing keywords.",
    color: "from-indigo-500/20 to-indigo-500/5",
  },
]

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Advanced technical capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Designed for professional content creators who need reliable, accurate metadata generation at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
