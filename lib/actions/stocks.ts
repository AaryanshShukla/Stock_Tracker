"use server"

import { finnhubClient } from "@/lib/finnhub-client"
import { MOCK_STOCKS, MARKET_INDICES, CHART_DATA } from "@/lib/mock-data"
import { generateRealtimeChartData } from "@/lib/chart-utils"
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
    return {
      data: MOCK_STOCKS.filter((s) => symbols.includes(s.symbol)),
      error: null,
      isUsingMockData: true,
    }
  }

  try {
    const quotes = await finnhubClient.getBatchQuotes(symbols)

    const stocks: Stock[] = quotes.map((quote) => ({
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

    return {
      data: stocks,
      error: null,
      isUsingMockData: false,
    }
  } catch (error) {
    console.error("Error fetching stock quotes:", error)
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

    const indexMap: Record<string, { name: string; symbol: string; multiplier: number }> = {
      SPY: { name: "S&P 500", symbol: "SPX", multiplier: 10 },
      QQQ: { name: "NASDAQ", symbol: "NDX", multiplier: 45 },
      DIA: { name: "DOW 30", symbol: "DJI", multiplier: 100 },
    }

    const indices: MarketIndex[] = quotes.map((quote) => {
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

    return {
      data: indices,
      error: null,
      isUsingMockData: false,
    }
  } catch (error) {
    console.error("Error fetching market indices:", error)
    return {
      data: MARKET_INDICES,
      error: error instanceof Error ? error.message : "Failed to fetch market indices",
      isUsingMockData: true,
    }
  }
}

/**
 * Fetch OHLC candle data for charts
 * Since Finnhub candles require premium, we generate realistic data based on current price
 */
export async function fetchStockCandles(
  symbol: string,
  range: "1D" | "1W" | "1M" | "3M" | "1Y" = "1M",
): Promise<FetchResult<ChartDataPoint[]>> {
  const { configured } = finnhubClient.checkConfiguration()

  // Try to get current price to generate realistic chart
  if (configured) {
    try {
      const quote = await finnhubClient.getQuote(symbol)
      const chartData = generateRealtimeChartData(quote.price, quote.changePercent, range)
      return {
        data: chartData,
        error: null,
        isUsingMockData: false, // Data is based on real current price
      }
    } catch (error) {
      console.error("Error generating chart data:", error)
    }
  }

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
      open: quote.open,
      previousClose: quote.previousClose,
      dayHigh: quote.high,
      dayLow: quote.low,
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
    console.error("Error fetching stock detail:", error)
    const mockStock = MOCK_STOCKS.find((s) => s.symbol === symbol)
    return {
      data: mockStock || null,
      error: error instanceof Error ? error.message : "Failed to fetch stock",
      isUsingMockData: true,
    }
  }
}

/**
 * Fetch prices for multiple symbols (for portfolio calculation)
 */
export async function fetchPortfolioPrices(
  symbols: string[],
): Promise<Record<string, { price: number; change: number; changePercent: number }>> {
  const { configured } = finnhubClient.checkConfiguration()

  if (!configured || symbols.length === 0) {
    // Return mock prices
    const mockPrices: Record<string, { price: number; change: number; changePercent: number }> = {}
    MOCK_STOCKS.forEach((stock) => {
      if (symbols.includes(stock.symbol)) {
        mockPrices[stock.symbol] = {
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        }
      }
    })
    return mockPrices
  }

  try {
    const quotes = await finnhubClient.getBatchQuotes(symbols)
    const prices: Record<string, { price: number; change: number; changePercent: number }> = {}

    quotes.forEach((quote) => {
      prices[quote.symbol] = {
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
      }
    })

    return prices
  } catch (error) {
    console.error("Error fetching portfolio prices:", error)
    // Fall back to mock
    const mockPrices: Record<string, { price: number; change: number; changePercent: number }> = {}
    MOCK_STOCKS.forEach((stock) => {
      if (symbols.includes(stock.symbol)) {
        mockPrices[stock.symbol] = {
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        }
      }
    })
    return mockPrices
  }
}
