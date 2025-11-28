"use client"

import { useState, useEffect, useCallback } from "react"
import type { Alert } from "@/types"

const ALERTS_STORAGE_KEY = "signalist-alerts"

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load alerts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY)
      if (stored) {
        setAlerts(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load alerts from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))
      } catch (error) {
        console.error("Failed to save alerts to localStorage:", error)
      }
    }
  }, [alerts, isLoading])

  const addAlert = useCallback((alert: Omit<Alert, "id" | "createdAt">) => {
    const newAlert: Alert = {
      ...alert,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setAlerts((prev) => [...prev, newAlert])
    return newAlert
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)))
  }, [])

  const getAlertsForSymbol = useCallback(
    (symbol: string) => {
      return alerts.filter((a) => a.symbol.toUpperCase() === symbol.toUpperCase())
    },
    [alerts],
  )

  const activeAlerts = alerts.filter((a) => a.isActive)
  const triggeredAlerts = alerts.filter((a) => !a.isActive && a.triggeredAt)

  return {
    alerts,
    activeAlerts,
    triggeredAlerts,
    isLoading,
    addAlert,
    removeAlert,
    toggleAlert,
    getAlertsForSymbol,
  }
}
