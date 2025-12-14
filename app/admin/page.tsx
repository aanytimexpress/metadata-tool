"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getActivities, getSectionUsageStats, getDailyActivityStats, getAllUserStats } from "@/lib/activity-tracker"
import { Header } from "@/components/header"
import {
  ArrowLeft,
  Users,
  BarChart3,
  ImageIcon,
  Download,
  Key,
  UserPlus,
  LogIn,
  LogOut,
  Settings,
  User,
  Clock,
  TrendingUp,
  Eye,
  Shield,
  RefreshCw,
  AlertTriangle,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Mail,
  ChevronDown,
  Check,
  Crown,
  Star,
  UserCog,
  Trash2,
  Ban,
  Loader2,
  Video,
  Upload,
} from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  plan: string
  createdAt: string
  role: string
  password?: string
  status?: string
}

const ROLES = [
  { value: "user", label: "User", color: "bg-blue-500/10 text-blue-500", icon: User },
  { value: "pro", label: "Pro User", color: "bg-cyan-500/10 text-cyan-500", icon: Star },
  { value: "admin", label: "Admin", color: "bg-red-500/10 text-red-500", icon: Shield },
]

const PLANS = [
  { value: "free", label: "Free", color: "bg-gray-500/10 text-gray-500", icon: User },
  { value: "pro", label: "Pro", color: "bg-cyan-500/10 text-cyan-500", icon: Star },
  { value: "enterprise", label: "Enterprise", color: "bg-purple-500/10 text-purple-500", icon: Crown },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const [activities, setActivities] = useState<any[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [sectionStats, setSectionStats] = useState<{ section: string; count: number }[]>([])
  const [dailyStats, setDailyStats] = useState<{ date: string; count: number }[]>([])
  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "activities">("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [activityFilter, setActivityFilter] = useState<string>("all")
  const [userStats, setUserStats] = useState<any[]>([])
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null)
  const [openPlanMenu, setOpenPlanMenu] = useState<string | null>(null)
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] Admin check - user:", user?.email, "isAdmin:", isAdmin, "isLoading:", isLoading)
  }, [user, isAdmin, isLoading])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && !isAdmin) {
      router.push("/")
    }
  }, [user, isLoading, isAdmin, router])

  useEffect(() => {
    if (user && isAdmin) {
      loadData()
    }
  }, [user, isAdmin])

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenRoleMenu(null)
      setOpenPlanMenu(null)
      setOpenActionMenu(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const loadData = () => {
    setActivities(getActivities(100))
    setSectionStats(getSectionUsageStats())
    setDailyStats(getDailyActivityStats(7))
    setUserStats(getAllUserStats())

    const savedUsers = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    setUsers(savedUsers)
  }

  const updateUserRole = (userId: string, newRole: string) => {
    const savedUsers = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    const updatedUsers = savedUsers.map((u: UserData) => (u.id === userId ? { ...u, role: newRole } : u))
    localStorage.setItem("metadatagen_users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setOpenRoleMenu(null)
  }

  const updateUserPlan = (userId: string, newPlan: string) => {
    const savedUsers = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    const updatedUsers = savedUsers.map((u: UserData) => (u.id === userId ? { ...u, plan: newPlan } : u))
    localStorage.setItem("metadatagen_users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setOpenPlanMenu(null)
  }

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const savedUsers = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
      const updatedUsers = savedUsers.filter((u: UserData) => u.id !== userId)
      localStorage.setItem("metadatagen_users", JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    }
    setOpenActionMenu(null)
  }

  const toggleUserStatus = (userId: string) => {
    const savedUsers = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    const updatedUsers = savedUsers.map((u: UserData) =>
      u.id === userId ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u,
    )
    localStorage.setItem("metadatagen_users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setOpenActionMenu(null)
  }

  const handlePlanMenuClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Plan menu clicked for user:", userId)
    console.log("[v0] Current openPlanMenu:", openPlanMenu)
    const newValue = openPlanMenu === userId ? null : userId
    console.log("[v0] Setting openPlanMenu to:", newValue)
    setOpenPlanMenu(newValue)
    setOpenRoleMenu(null)
    setOpenActionMenu(null)
  }

  const handleRoleMenuClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Role menu clicked for user:", userId)
    console.log("[v0] Current openRoleMenu:", openRoleMenu)
    const newValue = openRoleMenu === userId ? null : userId
    console.log("[v0] Setting openRoleMenu to:", newValue)
    setOpenRoleMenu(newValue)
    setOpenPlanMenu(null)
    setOpenActionMenu(null)
  }

  const handlePlanChange = (userId: string, newPlan: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Changing plan for user:", userId, "to:", newPlan)
    updateUserPlan(userId, newPlan)
  }

  const handleRoleChange = (userId: string, newRole: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Changing role for user:", userId, "to:", newRole)
    updateUserRole(userId, newRole)
  }

  const toggleBanUser = (userId: string) => {
    toggleUserStatus(userId)
    setOpenActionMenu(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Login Required</h1>
          <p className="text-muted-foreground mb-4">Please login to access the admin dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90"
          >
            <LogIn className="w-4 h-4" />
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Current email: <span className="font-mono bg-secondary px-2 py-1 rounded">{user.email}</span>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4" />
      case "logout":
        return <LogOut className="w-4 h-4" />
      case "register":
        return <UserPlus className="w-4 h-4" />
      case "file_upload":
        return <Upload className="w-4 h-4" />
      case "image_generated":
        return <ImageIcon className="w-4 h-4" />
      case "video_generated":
        return <Video className="w-4 h-4" />
      case "metadata_generated":
        return <BarChart3 className="w-4 h-4" />
      case "csv_export":
        return <Download className="w-4 h-4" />
      case "api_key_added":
        return <Key className="w-4 h-4" />
      case "settings_changed":
        return <Settings className="w-4 h-4" />
      case "profile_updated":
        return <User className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-green-500/10 text-green-500"
      case "logout":
        return "bg-gray-500/10 text-gray-500"
      case "register":
        return "bg-blue-500/10 text-blue-500"
      case "file_upload":
        return "bg-purple-500/10 text-purple-500"
      case "metadata_generated":
        return "bg-cyan-500/10 text-cyan-500"
      case "csv_export":
        return "bg-orange-500/10 text-orange-500"
      case "api_key_added":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalUsers = users.length
  const todayActivities = activities.filter(
    (a) => new Date(a.timestamp).toDateString() === new Date().toDateString(),
  ).length
  const totalMetadataGenerated = activities.filter((a) => a.type === "metadata_generated").length
  const totalExports = activities.filter((a) => a.type === "csv_export").length

  const maxDailyCount = Math.max(...dailyStats.map((d) => d.count), 1)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredActivities = activityFilter === "all" ? activities : activities.filter((a) => a.type === activityFilter)

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "login", label: "Logins" },
    { value: "logout", label: "Logouts" },
    { value: "register", label: "Registrations" },
    { value: "file_upload", label: "File Uploads" },
    { value: "image_generated", label: "Image Generated" },
    { value: "video_generated", label: "Video Generated" },
    { value: "metadata_generated", label: "Metadata Generated" },
    { value: "csv_export", label: "CSV Exports" },
    { value: "api_key_added", label: "API Key Added" },
    { value: "settings_changed", label: "Settings Changed" },
    { value: "profile_updated", label: "Profile Updated" },
  ]

  const getRoleInfo = (role: string) => ROLES.find((r) => r.value === role) || ROLES[0]
  const getPlanInfo = (plan: string) => PLANS.find((p) => p.value === plan) || PLANS[0]

  return (
    <div
      className="min-h-screen bg-background"
      onClick={() => {
        setOpenPlanMenu(null)
        setOpenRoleMenu(null)
        setOpenActionMenu(null)
      }}
    >
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Generator
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Monitor user activities and manage users</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Users</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{todayActivities}</p>
            <p className="text-sm text-muted-foreground mt-1">Today's Activity</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalMetadataGenerated}</p>
            <p className="text-sm text-muted-foreground mt-1">Metadata Generated</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalExports}</p>
            <p className="text-sm text-muted-foreground mt-1">CSV Exports</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: Eye },
            { id: "users", label: "Users", icon: Users },
            { id: "activities", label: "Activity Log", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Last 7 Days Activity
              </h3>
              <div className="flex items-end justify-between gap-3 h-48">
                {dailyStats.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{day.count}</span>
                    <div className="w-full bg-secondary rounded-lg overflow-hidden" style={{ height: "160px" }}>
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-lg transition-all duration-500"
                        style={{
                          height: `${Math.max((day.count / maxDailyCount) * 100, 5)}%`,
                          marginTop: "auto",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Usage */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Most Used Sections
              </h3>
              <div className="space-y-4">
                {sectionStats.length > 0 ? (
                  sectionStats.slice(0, 6).map((stat, index) => (
                    <div key={stat.section} className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground">{stat.section}</span>
                          <span className="text-sm font-semibold text-primary">{stat.count}</span>
                        </div>
                        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                            style={{ width: `${(stat.count / (sectionStats[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No activity data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Registrations - Overview */}
            <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Recent Registrations
              </h3>
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((u) => {
                        const roleInfo = getRoleInfo(u.role || "user")
                        const planInfo = getPlanInfo(u.plan || "free")
                        return (
                          <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-primary">
                                    {u.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-foreground">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">{u.email}</td>

                            {/* Plan Dropdown */}
                            <td className="py-4 px-4">
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenPlanMenu(openPlanMenu === `overview-${u.id}` ? null : `overview-${u.id}`)
                                    setOpenRoleMenu(null)
                                    setOpenActionMenu(null)
                                  }}
                                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${planInfo.color} hover:opacity-80 transition-opacity cursor-pointer`}
                                >
                                  <planInfo.icon className="w-3 h-3" />
                                  {planInfo.label.toUpperCase()}
                                  <ChevronDown className="w-3 h-3" />
                                </button>

                                {openPlanMenu === `overview-${u.id}` && (
                                  <div className="absolute z-50 top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[140px]">
                                    {PLANS.map((plan) => (
                                      <button
                                        key={plan.value}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          updateUserPlan(u.id, plan.value)
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors ${u.plan === plan.value ? "bg-secondary/30" : ""}`}
                                      >
                                        <plan.icon className={`w-4 h-4 ${plan.color.split(" ")[1]}`} />
                                        <span>{plan.label}</span>
                                        {u.plan === plan.value && <Check className="w-4 h-4 ml-auto text-primary" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Role Dropdown */}
                            <td className="py-4 px-4">
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenRoleMenu(openRoleMenu === `overview-${u.id}` ? null : `overview-${u.id}`)
                                    setOpenPlanMenu(null)
                                    setOpenActionMenu(null)
                                  }}
                                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${roleInfo.color} hover:opacity-80 transition-opacity cursor-pointer`}
                                >
                                  <roleInfo.icon className="w-3 h-3" />
                                  {roleInfo.label.toUpperCase()}
                                  <ChevronDown className="w-3 h-3" />
                                </button>

                                {openRoleMenu === `overview-${u.id}` && (
                                  <div className="absolute z-50 top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[140px]">
                                    {ROLES.map((role) => (
                                      <button
                                        key={role.value}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          updateUserRole(u.id, role.value)
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors ${u.role === role.value ? "bg-secondary/30" : ""}`}
                                      >
                                        <role.icon className={`w-4 h-4 ${role.color.split(" ")[1]}`} />
                                        <span>{role.label}</span>
                                        {u.role === role.value && <Check className="w-4 h-4 ml-auto text-primary" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-sm text-muted-foreground">
                              {new Date(u.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4">
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenActionMenu(openActionMenu === `overview-${u.id}` ? null : `overview-${u.id}`)
                                    setOpenRoleMenu(null)
                                    setOpenPlanMenu(null)
                                  }}
                                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>

                                {openActionMenu === `overview-${u.id}` && (
                                  <div className="absolute z-50 top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[160px]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        alert(`Email sent to ${u.email}`)
                                        setOpenActionMenu(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors"
                                    >
                                      <Mail className="w-4 h-4" />
                                      <span>Send Email</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleUserStatus(u.id)
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors text-amber-500"
                                    >
                                      <Ban className="w-4 h-4" />
                                      <span>{u.status === "banned" ? "Unban User" : "Ban User"}</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteUser(u.id)
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 transition-colors text-red-500"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete User</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No users registered yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab - Updated Table */}
        {selectedTab === "users" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <UserCog className="w-5 h-5 text-primary" />
                User Management ({users.length})
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Role/Plan Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-secondary/30 rounded-xl">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Roles:</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => (
                    <span
                      key={role.value}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${role.color}`}
                    >
                      <role.icon className="w-3 h-3" />
                      {role.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-l border-border pl-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Plans:</p>
                <div className="flex flex-wrap gap-2">
                  {PLANS.map((plan) => (
                    <span
                      key={plan.value}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${plan.color}`}
                    >
                      <plan.icon className="w-3 h-3" />
                      {plan.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {filteredUsers.length > 0 ? (
              <div className="relative">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const roleInfo = getRoleInfo(u.role || "user")
                      const planInfo = getPlanInfo(u.plan || "free")
                      const isBanned = u.status === "banned"

                      return (
                        <tr
                          key={u.id}
                          className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${isBanned ? "opacity-60" : ""}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 ${isBanned ? "bg-red-500/20" : "bg-gradient-to-br from-primary/20 to-primary/10"} rounded-full flex items-center justify-center`}
                              >
                                <span className={`text-sm font-bold ${isBanned ? "text-red-500" : "text-primary"}`}>
                                  {u.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{u.name}</span>
                                {isBanned && <span className="ml-2 text-xs text-red-500">(Banned)</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{u.email}</td>

                          <td className="py-4 px-4 relative">
                            <button
                              onClick={(e) => handlePlanMenuClick(u.id, e)}
                              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${planInfo.color} hover:opacity-80 transition-opacity cursor-pointer`}
                            >
                              <planInfo.icon className="w-3 h-3" />
                              {planInfo.label.toUpperCase()}
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {openPlanMenu === u.id && (
                              <div
                                className="absolute z-[100] top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-2xl py-1 min-w-[160px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {PLANS.map((plan) => (
                                  <button
                                    key={plan.value}
                                    onClick={(e) => handlePlanChange(u.id, plan.value, e)}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${u.plan === plan.value ? "bg-secondary/30" : ""}`}
                                  >
                                    <plan.icon className={`w-4 h-4 ${plan.color.split(" ")[1]}`} />
                                    <span>{plan.label}</span>
                                    {u.plan === plan.value && <Check className="w-4 h-4 ml-auto text-primary" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 relative">
                            <button
                              onClick={(e) => handleRoleMenuClick(u.id, e)}
                              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${roleInfo.color} hover:opacity-80 transition-opacity cursor-pointer`}
                            >
                              <roleInfo.icon className="w-3 h-3" />
                              {roleInfo.label.toUpperCase()}
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {openRoleMenu === u.id && (
                              <div
                                className="absolute z-[100] top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-2xl py-1 min-w-[160px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {ROLES.map((role) => (
                                  <button
                                    key={role.value}
                                    onClick={(e) => handleRoleChange(u.id, role.value, e)}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${u.role === role.value ? "bg-secondary/30" : ""}`}
                                  >
                                    <role.icon className={`w-4 h-4 ${role.color.split(" ")[1]}`} />
                                    <span>{role.label}</span>
                                    {u.role === role.value && <Check className="w-4 h-4 ml-auto text-primary" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${isBanned ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}
                            >
                              {isBanned ? "BANNED" : "ACTIVE"}
                            </span>
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          <td className="py-4 px-4 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenActionMenu(openActionMenu === u.id ? null : u.id)
                                setOpenPlanMenu(null)
                                setOpenRoleMenu(null)
                              }}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {openActionMenu === u.id && (
                              <div
                                className="absolute z-[100] top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl py-1 min-w-[160px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    alert(`Send email to ${u.email}`)
                                    setOpenActionMenu(null)
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span>Send Email</span>
                                </button>
                                <button
                                  onClick={() => toggleBanUser(u.id)}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${isBanned ? "text-emerald-500" : "text-amber-500"}`}
                                >
                                  <Ban className="w-4 h-4" />
                                  <span>{isBanned ? "Unban User" : "Ban User"}</span>
                                </button>
                                <button
                                  onClick={() => deleteUser(u.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete User</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{searchQuery ? "No users found matching your search" : "No users registered yet"}</p>
              </div>
            )}
          </div>
        )}

        {/* Activities Tab */}
        {selectedTab === "activities" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground">Activity Log</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="px-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {activityTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getActivityColor(
                        activity.type,
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-sm text-muted-foreground">{activity.userName}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {activity.userEmail}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getActivityColor(activity.type)}`}>
                          {activity.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No activities recorded yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
