"use server"

import { finnhubClient } from "@/lib/finnhub-client"
import { MOCK_STOCKS, MARKET_INDICES, CHART_DATA } from "@/lib/mock-data"
import type { Stock, MarketIndex, ChartDataPoint } from "@/types"

// Default symbols to fetch
const DEFAULT_STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "ORCL", "CRM"]
const INDEX_ETF_SYMBOLS = ["SPY", "QQQ", "DIA"] // ETFs that track major indices

interface FetchResult<T> {
  data: T | null
  error: string | null
  isUsingMockData: boolean
}

/**
 * Fetch stock quotes - returns real data if API configured, mock data otherwise
 */
export async function fetchStockQuotes(symbols: string[] = DEFAULT_STOCK_SYMBOLS): Promise<FetchResult<Stock[]>> {
  const { configured } = finnhubClient.checkConfiguration()

  if (!configured) {
    // Return mock data if API not configured
    return {
      data: MOCK_STOCKS.filter((s) => symbols.includes(s.symbol)),
      error: null,
      isUsingMockData: true,
    }
  }

  try {
    const quotes = await finnhubClient.getBatchQuotes(symbols)

    // Transform to Stock type
    const stocks: Stock[] = quotes.map((quote) => ({
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: 0, // Not available in basic quote
      marketCap: "N/A",
      peRatio: 0,
      high52Week: quote.high,
      low52Week: quote.low,
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Technology",
    }))

    return {
      data: stocks,
      error: null,
      isUsingMockData: false,
    }
  } catch (error) {
    console.error("[v0] Error fetching stock quotes:", error)
    // Fall back to mock data on error
    return {
      data: MOCK_STOCKS.filter((s) => symbols.includes(s.symbol)),
      error: error instanceof Error ? error.message : "Failed to fetch stock data",
      isUsingMockData: true,
    }
  }
}

/**
 * Fetch market indices data
 */
export async function fetchMarketIndices(): Promise<FetchResult<MarketIndex[]>> {
  const { configured } = finnhubClient.checkConfiguration()

  if (!configured) {
    return {
      data: MARKET_INDICES,
      error: null,
      isUsingMockData: true,
    }
  }

  try {
    const quotes = await finnhubClient.getBatchQuotes(INDEX_ETF_SYMBOLS)

    // Map ETF quotes to market index format
    const indexMap: Record<string, { name: string; symbol: string }> = {
      SPY: { name: "S&P 500", symbol: "SPX" },
      QQQ: { name: "NASDAQ", symbol: "NDX" },
      DIA: { name: "DOW 30", symbol: "DJI" },
    }

    const indices: MarketIndex[] = quotes.map((quote) => {
      const indexInfo = indexMap[quote.symbol]
      return {
        name: indexInfo?.name || quote.name,
        symbol: indexInfo?.symbol || quote.symbol,
        value: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        // Approximate actual index values from ETF prices
        ...(quote.symbol === "SPY" && { value: quote.price * 10 }),
        ...(quote.symbol === "QQQ" && { value: quote.price * 45 }),
        ...(quote.symbol === "DIA" && { value: quote.price * 100 }),
      }
    })

    return {
      data: indices,
      error: null,
      isUsingMockData: false,
    }
  } catch (error) {
    console.error("[v0] Error fetching market indices:", error)
    return {
      data: MARKET_INDICES,
      error: error instanceof Error ? error.message : "Failed to fetch market indices",
      isUsingMockData: true,
    }
  }
}

/**
 * Fetch OHLC candle data for charts
 */
export async function fetchStockCandles(
  symbol: string,
  range: "1D" | "1W" | "1M" | "3M" | "1Y" = "1M",
): Promise<FetchResult<ChartDataPoint[]>> {
  // Finnhub candle endpoint requires premium subscription
  // Always use mock chart data for now - quotes endpoint still works for real-time prices
  return {
    data: CHART_DATA,
    error: null,
    isUsingMockData: true,
  }
}

/**
 * Fetch a single stock quote with full details
 */
export async function fetchStockDetail(symbol: string): Promise<FetchResult<Stock>> {
  const { configured } = finnhubClient.checkConfiguration()

  if (!configured) {
    const mockStock = MOCK_STOCKS.find((s) => s.symbol === symbol)
    return {
      data: mockStock || null,
      error: mockStock ? null : "Stock not found",
      isUsingMockData: true,
    }
  }

  try {
    const quote = await finnhubClient.getQuote(symbol)

    const stock: Stock = {
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
    }

    return {
      data: stock,
      error: null,
      isUsingMockData: false,
    }
  } catch (error) {
    console.error("[v0] Error fetching stock detail:", error)
    const mockStock = MOCK_STOCKS.find((s) => s.symbol === symbol)
    return {
      data: mockStock || null,
      error: error instanceof Error ? error.message : "Failed to fetch stock",
      isUsingMockData: true,
    }
  }
}
