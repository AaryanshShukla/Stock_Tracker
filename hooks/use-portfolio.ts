"use client"

import { useState, useEffect, useCallback } from "react"
import type { PortfolioHolding, Portfolio } from "@/types"

const PORTFOLIO_STORAGE_KEY = "signalist_portfolio"

// Default holdings for demo
const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  { symbol: "AAPL", name: "Apple Inc", shares: 10, avgCost: 150.0, purchaseDate: "2024-01-15" },
  { symbol: "MSFT", name: "Microsoft Corp", shares: 5, avgCost: 380.0, purchaseDate: "2024-02-20" },
  { symbol: "GOOGL", name: "Alphabet Inc", shares: 3, avgCost: 140.0, purchaseDate: "2024-03-10" },
  { symbol: "TSLA", name: "Tesla Inc", shares: 8, avgCost: 200.0, purchaseDate: "2024-01-25" },
  { symbol: "NVDA", name: "NVIDIA Corp", shares: 4, avgCost: 450.0, purchaseDate: "2024-04-05" },
]

export function usePortfolio() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load holdings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
      if (stored) {
        try {
          setHoldings(JSON.parse(stored))
        } catch {
          setHoldings(DEFAULT_HOLDINGS)
          localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(DEFAULT_HOLDINGS))
        }
      } else {
        // Initialize with default holdings for demo
        setHoldings(DEFAULT_HOLDINGS)
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(DEFAULT_HOLDINGS))
      }
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever holdings change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings))
    }
  }, [holdings, isLoaded])

  const addHolding = useCallback((holding: Omit<PortfolioHolding, "purchaseDate">) => {
    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === holding.symbol)
      if (existing) {
        // Average down/up the position
        const totalShares = existing.shares + holding.shares
        const totalCost = existing.shares * existing.avgCost + holding.shares * holding.avgCost
        return prev.map((h) =>
          h.symbol === holding.symbol ? { ...h, shares: totalShares, avgCost: totalCost / totalShares } : h,
        )
      }
      return [...prev, { ...holding, purchaseDate: new Date().toISOString().split("T")[0] }]
    })
  }, [])

  const removeHolding = useCallback((symbol: string) => {
    setHoldings((prev) => prev.filter((h) => h.symbol !== symbol))
  }, [])

  const updateShares = useCallback(
    (symbol: string, shares: number) => {
      if (shares <= 0) {
        removeHolding(symbol)
        return
      }
      setHoldings((prev) => prev.map((h) => (h.symbol === symbol ? { ...h, shares } : h)))
    },
    [removeHolding],
  )

  const calculatePortfolio = useCallback(
    (stockPrices: Record<string, { price: number; change: number; changePercent: number }>): Portfolio => {
      let totalValue = 0
      let totalCost = 0
      let dayChange = 0

      const enrichedHoldings: PortfolioHolding[] = holdings.map((holding) => {
        const priceData = stockPrices[holding.symbol]
        const currentPrice = priceData?.price || holding.avgCost
        const currentValue = currentPrice * holding.shares
        const costBasis = holding.avgCost * holding.shares
        const gainLoss = currentValue - costBasis
        const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0

        totalValue += currentValue
        totalCost += costBasis

        // Calculate day change based on stock's daily change
        if (priceData) {
          dayChange += priceData.change * holding.shares
        }

        return {
          ...holding,
          currentPrice,
          currentValue,
          gainLoss,
          gainLossPercent,
        }
      })

      const totalGain = totalValue - totalCost
      const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
      const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

      return {
        totalValue,
        dayChange,
        dayChangePercent,
        totalGain,
        totalGainPercent,
        holdings: enrichedHoldings,
      }
    },
    [holdings],
  )

  return {
    holdings,
    isLoaded,
    addHolding,
    removeHolding,
    updateShares,
    calculatePortfolio,
  }
}
