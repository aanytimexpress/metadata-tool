// Activity Types
export type ActivityType =
  | "login"
  | "register"
  | "logout"
  | "file_upload"
  | "metadata_generated"
  | "csv_export"
  | "api_key_added"
  | "settings_changed"
  | "profile_updated"

export interface Activity {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: ActivityType
  description: string
  metadata?: Record<string, any>
  timestamp: string
  ip?: string
  userAgent?: string
}

export interface UserStats {
  userId: string
  totalUploads: number
  totalMetadataGenerated: number
  totalCsvExports: number
  lastActive: string
  sessionsCount: number
}

// Track activity
export function trackActivity(
  userId: string,
  userName: string,
  userEmail: string,
  type: ActivityType,
  description: string,
  metadata?: Record<string, any>,
) {
  const activities: Activity[] = JSON.parse(localStorage.getItem("metadatagen_activities") || "[]")

  const newActivity: Activity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    userEmail,
    type,
    description,
    metadata,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  }

  activities.unshift(newActivity)

  // Keep only last 1000 activities
  if (activities.length > 1000) {
    activities.pop()
  }

  localStorage.setItem("metadatagen_activities", JSON.stringify(activities))

  // Update user stats
  updateUserStats(userId, type)

  return newActivity
}

// Update user stats
function updateUserStats(userId: string, type: ActivityType) {
  const allStats: Record<string, UserStats> = JSON.parse(localStorage.getItem("metadatagen_user_stats") || "{}")

  if (!allStats[userId]) {
    allStats[userId] = {
      userId,
      totalUploads: 0,
      totalMetadataGenerated: 0,
      totalCsvExports: 0,
      lastActive: new Date().toISOString(),
      sessionsCount: 0,
    }
  }

  allStats[userId].lastActive = new Date().toISOString()

  switch (type) {
    case "file_upload":
      allStats[userId].totalUploads++
      break
    case "metadata_generated":
      allStats[userId].totalMetadataGenerated++
      break
    case "csv_export":
      allStats[userId].totalCsvExports++
      break
    case "login":
      allStats[userId].sessionsCount++
      break
  }

  localStorage.setItem("metadatagen_user_stats", JSON.stringify(allStats))
}

// Get all activities
export function getActivities(limit?: number): Activity[] {
  const activities: Activity[] = JSON.parse(localStorage.getItem("metadatagen_activities") || "[]")
  return limit ? activities.slice(0, limit) : activities
}

// Get activities by user
export function getActivitiesByUser(userId: string, limit?: number): Activity[] {
  const activities: Activity[] = JSON.parse(localStorage.getItem("metadatagen_activities") || "[]")
  const userActivities = activities.filter((a) => a.userId === userId)
  return limit ? userActivities.slice(0, limit) : userActivities
}

// Get user stats
export function getUserStats(userId: string): UserStats | null {
  const allStats: Record<string, UserStats> = JSON.parse(localStorage.getItem("metadatagen_user_stats") || "{}")
  return allStats[userId] || null
}

// Get all user stats
export function getAllUserStats(): UserStats[] {
  const allStats: Record<string, UserStats> = JSON.parse(localStorage.getItem("metadatagen_user_stats") || "{}")
  return Object.values(allStats)
}

// Get section usage stats
export function getSectionUsageStats(): { section: string; count: number }[] {
  const activities: Activity[] = JSON.parse(localStorage.getItem("metadatagen_activities") || "[]")

  const sectionMap: Record<string, string> = {
    file_upload: "File Upload",
    metadata_generated: "Metadata Generation",
    csv_export: "CSV Export",
    api_key_added: "API Settings",
    settings_changed: "Settings",
    profile_updated: "Profile",
    login: "Authentication",
    register: "Authentication",
    logout: "Authentication",
  }

  const counts: Record<string, number> = {}

  activities.forEach((activity) => {
    const section = sectionMap[activity.type] || "Other"
    counts[section] = (counts[section] || 0) + 1
  })

  return Object.entries(counts)
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count)
}

// Get daily activity stats for chart
export function getDailyActivityStats(days = 7): { date: string; count: number }[] {
  const activities: Activity[] = JSON.parse(localStorage.getItem("metadatagen_activities") || "[]")

  const stats: Record<string, number> = {}
  const now = new Date()

  // Initialize all days with 0
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    stats[dateStr] = 0
  }

  // Count activities
  activities.forEach((activity) => {
    const dateStr = activity.timestamp.split("T")[0]
    if (stats[dateStr] !== undefined) {
      stats[dateStr]++
    }
  })

  return Object.entries(stats).map(([date, count]) => ({ date, count }))
}
