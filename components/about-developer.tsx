import { Mail, Linkedin, Globe } from "lucide-react"
import Image from "next/image"

export function AboutDeveloper() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet the Developer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">The creative mind behind MetadataGen</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Profile Image & Info */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="relative w-40 h-48 mx-auto md:mx-0 mb-6">
                  <Image
                    src="/images/shahadat-bappi.jpg"
                    alt="Shahadat Hossain Bappi"
                    fill
                    className="rounded-2xl object-cover object-top shadow-xl"
                  />
                </div>

                <h3 className="text-2xl font-bold text-foreground">SHAHADAT HOSSAIN BAPPI</h3>
                <p className="text-primary font-medium mt-1">Senior Graphic Designer</p>
                <p className="text-sm text-muted-foreground">at DesignXpress</p>

                <div className="flex justify-center md:justify-start gap-8 mt-6 py-4 px-6 bg-secondary/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">8+</p>
                    <p className="text-xs text-muted-foreground">Years Exp</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">2017</p>
                    <p className="text-xs text-muted-foreground">Since</p>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start gap-3 mt-6">
                  <a
                    href="mailto:contact@designxpress.com"
                    className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-10 h-10 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Bio & Skills */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-foreground mb-4">About Me</h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Hi There, It's Me Shahadat Hossain and Senior Graphic Designer at DesignXpress. I have been working on
                  this field since 2017. I love to work with web-based templates. Also, I can do Print Template but my
                  first preference is web.
                </p>
                <p className="text-muted-foreground">Thanks,</p>

                {/* Supported Platforms */}
                <div className="mt-8">
                  <h5 className="font-semibold text-foreground mb-4">Supported Stock Platforms</h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Shutterstock", color: "#EE2B24" },
                      { name: "Adobe Stock", color: "#FF0000" },
                      { name: "iStock by Getty Images", color: "#000000" },
                      { name: "Depositphotos", color: "#009EE2" },
                      { name: "Dreamstime", color: "#7AC142" },
                      { name: "123RF", color: "#00B87A" },
                    ].map((platform) => (
                      <span
                        key={platform.name}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-xl font-medium"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: platform.color }} />
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Design Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {["Web Templates", "Print Templates", "Graphics"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Stock Photography</p>
                    <div className="flex flex-wrap gap-2">
                      {["Metadata", "SEO", "Keywording"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-accent/10 text-accent-foreground text-xs rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
