/**
 * Finnhub API Client
 * Typed client for interacting with Finnhub Stock API
 * API Key must be set via FINNHUB_API_KEY environment variable
 */

// API Response Types
export interface FinnhubQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price of the day
  l: number // Low price of the day
  o: number // Open price of the day
  pc: number // Previous close price
  t: number // Timestamp
}

export interface FinnhubCandle {
  c: number[] // Close prices
  h: number[] // High prices
  l: number[] // Low prices
  o: number[] // Open prices
  s: string // Status ('ok' or 'no_data')
  t: number[] // Timestamps
  v: number[] // Volume
}

export interface FinnhubCompanyProfile {
  country: string
  currency: string
  exchange: string
  finnhubIndustry: string
  ipo: string
  logo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
}

export interface StockQuoteResult {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

export interface CandleDataPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Stock name mapping (since Finnhub quote doesn't return company name)
const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc",
  MSFT: "Microsoft Corp",
  GOOGL: "Alphabet Inc",
  AMZN: "Amazon.com Inc",
  TSLA: "Tesla Inc",
  META: "Meta Platforms Inc",
  NVDA: "NVIDIA Corp",
  NFLX: "Netflix Inc",
  ORCL: "Oracle Corp",
  CRM: "Salesforce Inc",
  // Market indices ETFs
  SPY: "S&P 500 ETF",
  QQQ: "NASDAQ 100 ETF",
  DIA: "Dow Jones ETF",
}

class FinnhubClient {
  private baseUrl = "https://finnhub.io/api/v1"
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY
  }

  private get isConfigured(): boolean {
    return !!this.apiKey
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.isConfigured) {
      throw new Error("FINNHUB_API_KEY environment variable is not configured")
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.set("token", this.apiKey!)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later.")
      }
      throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get real-time quote for a single stock
   */
  async getQuote(symbol: string): Promise<StockQuoteResult> {
    const quote = await this.fetch<FinnhubQuote>("/quote", { symbol })

    // Check if we got valid data
    if (quote.c === 0 && quote.pc === 0) {
      throw new Error(`No data available for symbol: ${symbol}`)
    }

    return {
      symbol,
      name: STOCK_NAMES[symbol] || symbol,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      previousClose: quote.pc,
      timestamp: quote.t * 1000, // Convert to milliseconds
    }
  }

  /**
   * Get quotes for multiple stocks
   */
  async getBatchQuotes(symbols: string[]): Promise<StockQuoteResult[]> {
    const results = await Promise.allSettled(symbols.map((symbol) => this.getQuote(symbol)))

    return results
      .filter((result): result is PromiseFulfilledResult<StockQuoteResult> => result.status === "fulfilled")
      .map((result) => result.value)
  }

  /**
   * Get OHLC candle data for charts
   * @param symbol Stock symbol
   * @param resolution Candle resolution: 1, 5, 15, 30, 60, D, W, M
   * @param from Unix timestamp (seconds)
   * @param to Unix timestamp (seconds)
   */
  async getCandles(symbol: string, resolution = "D", from: number, to: number): Promise<CandleDataPoint[]> {
    const candles = await this.fetch<FinnhubCandle>("/stock/candle", {
      symbol,
      resolution,
      from: from.toString(),
      to: to.toString(),
    })

    if (candles.s !== "ok" || !candles.c?.length) {
      throw new Error(`No candle data available for ${symbol}`)
    }

    return candles.t.map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString(),
      open: candles.o[index],
      high: candles.h[index],
      low: candles.l[index],
      close: candles.c[index],
      volume: candles.v[index],
    }))
  }

  /**
   * Get company profile information
   */
  async getCompanyProfile(symbol: string): Promise<FinnhubCompanyProfile> {
    return this.fetch<FinnhubCompanyProfile>("/stock/profile2", { symbol })
  }

  /**
   * Check if the API is configured
   */
  checkConfiguration(): { configured: boolean; message: string } {
    if (this.isConfigured) {
      return { configured: true, message: "Finnhub API is configured" }
    }
    return {
      configured: false,
      message: "FINNHUB_API_KEY environment variable is not set",
    }
  }
}

// Export singleton instance
export const finnhubClient = new FinnhubClient()
