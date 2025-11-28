"use client"

import { useEffect, useState } from "react"
import type { UserSettings } from "@/types"

const SETTINGS_STORAGE_KEY = "signalist_settings"

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    priceAlerts: true,
    marketNews: true,
    portfolioUpdates: false,
    emailNotifications: true,
  },
  appearance: {
    darkMode: true,
    compactView: false,
  },
  regional: {
    language: "English (US)",
    currency: "USD ($)",
    timezone: "Eastern Time (ET)",
    dateFormat: "MM/DD/YYYY",
  },
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
  }

  // Update a specific notification setting
  const updateNotification = (key: keyof UserSettings["notifications"], value: boolean) => {
    const updated = {
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    }
    saveSettings(updated)
  }

  // Update a specific appearance setting
  const updateAppearance = (key: keyof UserSettings["appearance"], value: boolean) => {
    const updated = {
      ...settings,
      appearance: { ...settings.appearance, [key]: value },
    }
    saveSettings(updated)
  }

  // Update regional settings
  const updateRegional = (key: keyof UserSettings["regional"], value: string) => {
    const updated = {
      ...settings,
      regional: { ...settings.regional, [key]: value },
    }
    saveSettings(updated)
  }

  // Reset to defaults
  const resetSettings = () => {
    saveSettings(DEFAULT_SETTINGS)
  }

  return {
    settings,
    isLoaded,
    updateNotification,
    updateAppearance,
    updateRegional,
    resetSettings,
  }
}
