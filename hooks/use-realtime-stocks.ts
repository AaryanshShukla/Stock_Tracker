"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { Stock, MarketIndex, ChartDataPoint } from "@/types"

interface UseRealtimeStocksOptions {
  symbols?: string[]
  refreshInterval?: number // in milliseconds
  enabled?: boolean
}

interface RealtimeStocksState {
  stocks: Stock[]
  indices: MarketIndex[]
  chartData: ChartDataPoint[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  isUsingMockData: boolean
}

export function useRealtimeStocks(options: UseRealtimeStocksOptions = {}) {
  const { refreshInterval = 30000, enabled = true } = options

  const [state, setState] = useState<RealtimeStocksState>({
    stocks: [],
    indices: [],
    chartData: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
    isUsingMockData: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/stocks/realtime")
      if (!response.ok) throw new Error("Failed to fetch stock data")

      const data = await response.json()

      setState({
        stocks: data.stocks || [],
        indices: data.indices || [],
        chartData: data.chartData || [],
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        isUsingMockData: data.isUsingMockData ?? true,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [])

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }))
    fetchData()
  }, [fetchData])

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled) return

    fetchData()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, refreshInterval, fetchData])

  return {
    ...state,
    refresh,
  }
}
