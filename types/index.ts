import type React from "react"

// Core Stock type
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  volume: string | number
  high52Week?: number
  low52Week?: number
  // Keep old names for backward compatibility
  high52w?: number
  low52w?: number
  logo?: string
  exchange?: string
  sector?: string
  industry?: string
  peRatio?: number
  open?: number
  previousClose?: number
  dayHigh?: number
  dayLow?: number
}

// Extended stock with watchlist status
export interface WatchlistItem extends Stock {
  isInWatchlist: boolean
  addedAt?: string
}

// Alert type for price notifications
export interface Alert {
  id: string
  symbol: string
  name: string
  type: "above" | "below"
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt?: string
  triggeredAt?: string
}

// Market index data
export interface MarketIndex {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
}

// News article
export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  category: string
  imageUrl?: string
  url: string
  relatedSymbols?: string[]
}

// Chart data point
export interface ChartDataPoint {
  date: string
  price: number
  volume: number
  open?: number
  high?: number
  low?: number
  close?: number
}

// Portfolio summary
export interface Portfolio {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalGain: number
  totalGainPercent: number
  holdings?: PortfolioHolding[]
}

// Individual holding in portfolio
export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice?: number
  currentValue?: number
  gainLoss?: number
  gainLossPercent?: number
  purchaseDate: string
}

// Company info for detail page
export interface CompanyInfo {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  ceo: string
  employees: number
  headquarters: string
  founded?: string
  website?: string
}

// Navigation item
export interface NavItem {
  href: string
  label: string
  icon: string
}

// Time range options for charts
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL"

// Alert form data
export interface AlertFormData {
  symbol: string
  type: "above" | "below"
  targetPrice: number
}

// Metric card data
export interface Metric {
  label: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
  change?: number
}

// User type for authentication
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  createdAt: string
}

// Settings type for user preferences
export interface UserSettings {
  notifications: {
    priceAlerts: boolean
    marketNews: boolean
    portfolioUpdates: boolean
    emailNotifications: boolean
  }
  appearance: {
    darkMode: boolean
    compactView: boolean
  }
  regional: {
    language: string
    currency: string
    timezone: string
    dateFormat: string
  }
}
