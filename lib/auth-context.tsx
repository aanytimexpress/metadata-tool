"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { trackActivity } from "./activity-tracker"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  apiCallsUsed: number
  apiCallsLimit: number
  createdAt: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  isAdmin: boolean
  makeAdmin: (userId: string) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
}

const ADMIN_EMAILS = [
  "admin@metadatagen.com",
  "aanytime.xpress@gmail.com", // Your email
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("metadatagen_user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      if (ADMIN_EMAILS.includes(parsedUser.email) && parsedUser.role !== "admin") {
        parsedUser.role = "admin"
        localStorage.setItem("metadatagen_user", JSON.stringify(parsedUser))
      }
      setUser(parsedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    const foundUser = users.find((u: any) => u.email === email)

    if (!foundUser) {
      return { success: false, error: "No account found with this email" }
    }

    if (foundUser.password !== password) {
      return { success: false, error: "Invalid password" }
    }

    const isFirstUser = users.length === 1 || users[0].id === foundUser.id
    const isAdmin = ADMIN_EMAILS.includes(email) || foundUser.role === "admin" || isFirstUser

    const userData: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      plan: foundUser.plan || "free",
      apiCallsUsed: foundUser.apiCallsUsed || 0,
      apiCallsLimit: foundUser.plan === "pro" ? 5000 : foundUser.plan === "enterprise" ? 50000 : 100,
      createdAt: foundUser.createdAt,
      role: isAdmin ? "admin" : "user",
    }

    // Update role in users list too
    if (isAdmin && foundUser.role !== "admin") {
      const userIndex = users.findIndex((u: any) => u.id === foundUser.id)
      if (userIndex !== -1) {
        users[userIndex].role = "admin"
        localStorage.setItem("metadatagen_users", JSON.stringify(users))
      }
    }

    setUser(userData)
    localStorage.setItem("metadatagen_user", JSON.stringify(userData))

    trackActivity(userData.id, userData.name, userData.email, "login", `${userData.name} logged in`)

    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")

    if (users.find((u: any) => u.email === data.email)) {
      return { success: false, error: "An account with this email already exists" }
    }

    const isFirstUser = users.length === 0
    const isAdmin = ADMIN_EMAILS.includes(data.email) || isFirstUser

    const newUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      plan: "free" as const,
      apiCallsUsed: 0,
      apiCallsLimit: 100,
      createdAt: new Date().toISOString(),
      role: isAdmin ? "admin" : "user",
    }

    users.push(newUser)
    localStorage.setItem("metadatagen_users", JSON.stringify(users))

    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      plan: newUser.plan,
      apiCallsUsed: newUser.apiCallsUsed,
      apiCallsLimit: newUser.apiCallsLimit,
      createdAt: newUser.createdAt,
      role: newUser.role as "user" | "admin",
    }

    setUser(userData)
    localStorage.setItem("metadatagen_user", JSON.stringify(userData))

    trackActivity(userData.id, userData.name, userData.email, "register", `New user registered: ${userData.name}`)

    return { success: true }
  }

  const logout = () => {
    if (user) {
      trackActivity(user.id, user.name, user.email, "logout", `${user.name} logged out`)
    }
    setUser(null)
    localStorage.removeItem("metadatagen_user")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("metadatagen_user", JSON.stringify(updatedUser))

      const users = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data }
        localStorage.setItem("metadatagen_users", JSON.stringify(users))
      }

      trackActivity(user.id, user.name, user.email, "profile_updated", `${user.name} updated profile`)
    }
  }

  const makeAdmin = (userId: string) => {
    const users = JSON.parse(localStorage.getItem("metadatagen_users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex].role = "admin"
      localStorage.setItem("metadatagen_users", JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUser, isAdmin: user?.role === "admin", makeAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
