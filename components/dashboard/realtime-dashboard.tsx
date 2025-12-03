"use client"

import { useEffect, useState } from "react"
import { PortfolioCard } from "@/components/dashboard/portfolio-card"
import { MarketIndices } from "@/components/dashboard/market-indices"
import { StockChart } from "@/components/dashboard/stock-chart"
import { WatchlistTable } from "@/components/dashboard/watchlist-table"
import { TopMovers } from "@/components/dashboard/top-movers"
import { MarketNews } from "@/components/dashboard/market-news"
import { DataStatusBanner } from "@/components/dashboard/data-status-banner"
import { useRealtimeStocks } from "@/hooks/use-realtime-stocks"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { Stock, MarketIndex, ChartDataPoint, Portfolio } from "@/types"

interface RealtimeDashboardProps {
  initialStocks: Stock[]
  initialIndices: MarketIndex[]
  initialChartData: ChartDataPoint[]
  initialIsUsingMockData: boolean
  initialError: string | null
}

export function RealtimeDashboard({
  initialStocks,
  initialIndices,
  initialChartData,
  initialIsUsingMockData,
  initialError,
}: RealtimeDashboardProps) {
  const { stocks, indices, chartData, isLoading, error, lastUpdated, isUsingMockData, refresh } = useRealtimeStocks({
    refreshInterval: 30000,
  })

  const { holdings, calculatePortfolio } = usePortfolio()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)

  // Use real-time data if available, otherwise fall back to initial server data
  const displayStocks = stocks.length > 0 ? stocks : initialStocks
  const displayIndices = indices.length > 0 ? indices : initialIndices
  const displayChartData = chartData.length > 0 ? chartData : initialChartData
  const displayIsUsingMockData = stocks.length > 0 ? isUsingMockData : initialIsUsingMockData
  const displayError = stocks.length > 0 ? error : initialError

  // Calculate portfolio whenever stocks or holdings change
  useEffect(() => {
    if (displayStocks.length > 0 && holdings.length > 0) {
      const stockPrices: Record<string, { price: number; change: number; changePercent: number }> = {}
      displayStocks.forEach((stock) => {
        stockPrices[stock.symbol] = {
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        }
      })
      const calculatedPortfolio = calculatePortfolio(stockPrices)
      setPortfolio(calculatedPortfolio)
    }
  }, [displayStocks, holdings, calculatePortfolio])

  const featuredStock = displayStocks[0]

  return (
    <>
      {/* Page Header with refresh button */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back! Here&apos;s your market overview.
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <DataStatusBanner isUsingMockData={displayIsUsingMockData} error={displayError} />

      {/* Portfolio & Market Indices Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <PortfolioCard portfolio={portfolio} isLoading={isLoading && !portfolio} />
        </div>
        <div className="lg:col-span-3">
          <MarketIndices indices={displayIndices} isLoading={isLoading && indices.length === 0} />
        </div>
      </div>

      {/* Stock Chart */}
      <StockChart stock={featuredStock} initialChartData={displayChartData} />

      {/* Watchlist & Top Movers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <WatchlistTable stocks={displayStocks.slice(0, 5)} isLoading={isLoading && stocks.length === 0} />
        <TopMovers stocks={displayStocks} />
      </div>

      {/* Market News */}
      <MarketNews />
    </>
  )
}
