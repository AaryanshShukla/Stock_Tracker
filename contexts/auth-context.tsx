"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateUser: (data: Partial<User>) => void
}

interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_STORAGE_KEY = "signalist_auth"
const USERS_STORAGE_KEY = "signalist_users"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load auth state:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get all users from localStorage
  const getUsers = (): Record<string, { user: User; password: string }> => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  // Save users to localStorage
  const saveUsers = (users: Record<string, { user: User; password: string }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()
    const userRecord = users[email.toLowerCase()]

    if (!userRecord) {
      return { success: false, error: "No account found with this email" }
    }

    if (userRecord.password !== password) {
      return { success: false, error: "Incorrect password" }
    }

    setUser(userRecord.user)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userRecord.user))
    return { success: true }
  }

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()
    const emailKey = data.email.toLowerCase()

    if (users[emailKey]) {
      return { success: false, error: "An account with this email already exists" }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
    }

    users[emailKey] = { user: newUser, password: data.password }
    saveUsers(users)

    setUser(newUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
    return { success: true }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const updateUser = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))

    // Also update in users storage
    const users = getUsers()
    const emailKey = user.email.toLowerCase()
    if (users[emailKey]) {
      users[emailKey].user = updatedUser
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
