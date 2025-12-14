"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  User,
  Mail,
  Calendar,
  ArrowLeft,
  Edit2,
  Save,
  X,
  Crown,
  Zap,
  BarChart3,
  Download,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Header } from "@/components/header"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (user) {
      setName(user.name)
    }
  }, [user, isLoading, router])

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() })
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const usagePercentage = (user.apiCallsUsed / user.apiCallsLimit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Generator
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2 justify-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-1 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                    />
                    <button onClick={handleSave} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30">
                      <Save className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30"
                    >
                      <Edit2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-white/90 text-sm capitalize">{user.plan} Plan</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Upgrade Card */}
            {user.plan === "free" && (
              <div className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-foreground">Upgrade to Pro</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get 5,000 API calls/month, faster processing, and priority support.
                </p>
                <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  Upgrade Now - $9.99/mo
                </button>
              </div>
            )}
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Stats */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Usage Statistics
              </h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">API Calls Used</p>
                  <p className="text-2xl font-bold text-foreground">{user.apiCallsUsed}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-foreground">{user.apiCallsLimit - user.apiCallsUsed}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Monthly Limit</p>
                  <p className="text-2xl font-bold text-foreground">{user.apiCallsLimit}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage this month</span>
                  <span className="font-medium text-foreground">{usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usagePercentage > 80 ? "bg-red-500" : usagePercentage > 50 ? "bg-amber-500" : "bg-primary"}`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>

              <div className="space-y-3">
                {[
                  { action: "Generated metadata for 25 images", time: "2 hours ago", icon: CheckCircle },
                  { action: "Exported CSV for Shutterstock", time: "3 hours ago", icon: Download },
                  { action: "Generated metadata for 10 videos", time: "Yesterday", icon: CheckCircle },
                  { action: "Exported CSV for Adobe Stock", time: "2 days ago", icon: Download },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Your Plan Features
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { feature: "AI Metadata Generation", available: true },
                  { feature: "All 6 Stock Site CSV Exports", available: true },
                  { feature: "Multi-API Key Support", available: true },
                  { feature: "Batch Processing", available: true },
                  { feature: "Priority Processing", available: user.plan !== "free" },
                  { feature: "API Access", available: user.plan === "enterprise" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-3 rounded-xl ${item.available ? "bg-primary/5" : "bg-secondary/30 opacity-50"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${item.available ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                    >
                      {item.available ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <span className={`text-sm ${item.available ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
