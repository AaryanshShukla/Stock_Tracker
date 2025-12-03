import type { ChartDataPoint } from "@/types"

/**
 * Generate realistic intraday chart data based on current price
 * This simulates price movement when real candle data isn't available
 */
export function generateRealtimeChartData(
  currentPrice: number,
  changePercent: number,
  range: "1D" | "1W" | "1M" | "3M" | "1Y" = "1M",
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()

  // Determine number of data points and interval based on range
  let numPoints: number
  let intervalMs: number
  let dateFormat: (date: Date) => string

  switch (range) {
    case "1D":
      numPoints = 78 // 6.5 hours of trading, 5-min intervals
      intervalMs = 5 * 60 * 1000
      dateFormat = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      break
    case "1W":
      numPoints = 35 // 5 days * 7 points per day
      intervalMs = 60 * 60 * 1000
      dateFormat = (d) => d.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" })
      break
    case "1M":
      numPoints = 22 // ~22 trading days
      intervalMs = 24 * 60 * 60 * 1000
      dateFormat = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      break
    case "3M":
      numPoints = 65
      intervalMs = 24 * 60 * 60 * 1000
      dateFormat = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      break
    case "1Y":
      numPoints = 52 // Weekly data points
      intervalMs = 7 * 24 * 60 * 60 * 1000
      dateFormat = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      break
    default:
      numPoints = 22
      intervalMs = 24 * 60 * 60 * 1000
      dateFormat = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Calculate starting price based on change percent
  const startPrice = currentPrice / (1 + changePercent / 100)

  // Generate price path using random walk with drift toward current price
  let price = startPrice
  const drift = (currentPrice - startPrice) / numPoints
  const volatility = currentPrice * 0.002 // 0.2% volatility per step

  for (let i = 0; i < numPoints; i++) {
    const date = new Date(now.getTime() - (numPoints - i) * intervalMs)

    // Random walk with drift
    const random = (Math.random() - 0.5) * 2 * volatility
    price = price + drift + random

    // Ensure price stays positive and reasonable
    price = Math.max(price, currentPrice * 0.8)
    price = Math.min(price, currentPrice * 1.2)

    // On last point, snap to current price
    if (i === numPoints - 1) {
      price = currentPrice
    }

    const dayVolatility = volatility * 2
    const open = price - (Math.random() - 0.5) * dayVolatility
    const high = Math.max(price, open) + Math.random() * dayVolatility
    const low = Math.min(price, open) - Math.random() * dayVolatility

    data.push({
      date: dateFormat(date),
      price: Number(price.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    })
  }

  return data
}

/**
 * Generate chart data for market index based on current value
 */
export function generateIndexChartData(
  currentValue: number,
  changePercent: number,
  range: "1D" | "1W" | "1M" | "3M" | "1Y" = "1D",
): ChartDataPoint[] {
  return generateRealtimeChartData(currentValue, changePercent, range)
}
