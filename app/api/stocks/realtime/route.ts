import { NextResponse } from "next/server"
import { finnhubClient } from "@/lib/finnhub-client"
import { MOCK_STOCKS, MARKET_INDICES, CHART_DATA } from "@/lib/mock-data"
import { generateRealtimeChartData } from "@/lib/chart-utils"
import type { Stock, MarketIndex } from "@/types"

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "ORCL", "CRM"]
const INDEX_ETF_SYMBOLS = ["SPY", "QQQ", "DIA"]

export async function GET() {
  const { configured } = finnhubClient.checkConfiguration()

  if (!configured) {
    return NextResponse.json({
      stocks: MOCK_STOCKS,
      indices: MARKET_INDICES,
      chartData: CHART_DATA,
      isUsingMockData: true,
    })
  }

  try {
    // Fetch stocks and indices in parallel
    const [stockQuotes, indexQuotes] = await Promise.all([
      finnhubClient.getBatchQuotes(DEFAULT_SYMBOLS),
      finnhubClient.getBatchQuotes(INDEX_ETF_SYMBOLS),
    ])

    // Transform stock quotes
    const stocks: Stock[] = stockQuotes.map((quote) => ({
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: 0,
      marketCap: "N/A",
      peRatio: 0,
      high52Week: quote.high,
      low52Week: quote.low,
      open: quote.open,
      previousClose: quote.previousClose,
      dayHigh: quote.high,
      dayLow: quote.low,
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Technology",
    }))

    // Map ETF quotes to indices
    const indexMap: Record<string, { name: string; symbol: string; multiplier: number }> = {
      SPY: { name: "S&P 500", symbol: "SPX", multiplier: 10 },
      QQQ: { name: "NASDAQ", symbol: "NDX", multiplier: 45 },
      DIA: { name: "DOW 30", symbol: "DJI", multiplier: 100 },
    }

    const indices: MarketIndex[] = indexQuotes.map((quote) => {
      const indexInfo = indexMap[quote.symbol]
      const multiplier = indexInfo?.multiplier || 1
      return {
        name: indexInfo?.name || quote.name,
        symbol: indexInfo?.symbol || quote.symbol,
        value: Number((quote.price * multiplier).toFixed(2)),
        change: Number((quote.change * multiplier).toFixed(2)),
        changePercent: quote.changePercent,
      }
    })

    const firstStock = stockQuotes[0]
    const chartData = firstStock
      ? generateRealtimeChartData(firstStock.price, firstStock.changePercent, "1M")
      : CHART_DATA

    return NextResponse.json({
      stocks,
      indices,
      chartData,
      isUsingMockData: false,
    })
  } catch (error) {
    console.error("Error fetching realtime data:", error)
    return NextResponse.json({
      stocks: MOCK_STOCKS,
      indices: MARKET_INDICES,
      chartData: CHART_DATA,
      isUsingMockData: true,
      error: error instanceof Error ? error.message : "Failed to fetch data",
    })
  }
}
