import { NextResponse } from "next/server"
import { finnhubClient } from "@/lib/finnhub-client"
import { MOCK_STOCKS, MARKET_INDICES, CHART_DATA } from "@/lib/mock-data"
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
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Technology",
    }))

    // Map ETF quotes to indices
    const indexMap: Record<string, { name: string; symbol: string }> = {
      SPY: { name: "S&P 500", symbol: "SPX" },
      QQQ: { name: "NASDAQ", symbol: "NDX" },
      DIA: { name: "DOW 30", symbol: "DJI" },
    }

    const indices: MarketIndex[] = indexQuotes.map((quote) => {
      const indexInfo = indexMap[quote.symbol]
      let value = quote.price
      if (quote.symbol === "SPY") value = quote.price * 10
      if (quote.symbol === "QQQ") value = quote.price * 45
      if (quote.symbol === "DIA") value = quote.price * 100

      return {
        name: indexInfo?.name || quote.name,
        symbol: indexInfo?.symbol || quote.symbol,
        value,
        change: quote.change,
        changePercent: quote.changePercent,
      }
    })

    return NextResponse.json({
      stocks,
      indices,
      chartData: CHART_DATA, // Charts still use mock data (premium endpoint)
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
