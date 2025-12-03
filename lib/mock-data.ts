import type {
  WatchlistItem,
  MarketIndex,
  NewsItem,
  ChartDataPoint,
  Portfolio,
  Alert,
  CompanyInfo,
  NavItem,
} from "@/types"

export const mockStocks: WatchlistItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.34,
    changePercent: 1.33,
    marketCap: "2.79T",
    volume: "52.3M",
    high52w: 199.62,
    low52w: 164.08,
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    isInWatchlist: true,
    addedAt: "2024-01-15",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.91,
    change: 4.56,
    changePercent: 1.22,
    marketCap: "2.81T",
    volume: "21.4M",
    high52w: 420.82,
    low52w: 309.45,
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software",
    isInWatchlist: true,
    addedAt: "2024-01-10",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 141.8,
    change: -1.23,
    changePercent: -0.86,
    marketCap: "1.78T",
    volume: "18.7M",
    high52w: 155.54,
    low52w: 115.83,
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Internet Services",
    isInWatchlist: false,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.25,
    change: 3.45,
    changePercent: 1.97,
    marketCap: "1.85T",
    volume: "35.2M",
    high52w: 189.77,
    low52w: 118.35,
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Internet Retail",
    isInWatchlist: true,
    addedAt: "2024-02-01",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 495.22,
    change: 12.87,
    changePercent: 2.67,
    marketCap: "1.22T",
    volume: "42.1M",
    high52w: 505.48,
    low52w: 222.97,
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    isInWatchlist: true,
    addedAt: "2024-01-20",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 238.45,
    change: -5.67,
    changePercent: -2.32,
    marketCap: "758.2B",
    volume: "98.4M",
    high52w: 299.29,
    low52w: 152.37,
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    isInWatchlist: false,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 326.49,
    change: 6.78,
    changePercent: 2.12,
    marketCap: "837.5B",
    volume: "15.3M",
    high52w: 342.92,
    low52w: 197.16,
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Internet Services",
    isInWatchlist: false,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 148.32,
    change: 1.23,
    changePercent: 0.84,
    marketCap: "427.8B",
    volume: "8.7M",
    high52w: 172.96,
    low52w: 123.11,
    exchange: "NYSE",
    sector: "Financial Services",
    industry: "Banks",
    isInWatchlist: false,
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "above",
    targetPrice: 185.0,
    currentPrice: 178.72,
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    type: "below",
    targetPrice: 480.0,
    currentPrice: 495.22,
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "above",
    targetPrice: 250.0,
    currentPrice: 238.45,
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "below",
    targetPrice: 370.0,
    currentPrice: 378.91,
    isActive: false,
    createdAt: "2024-01-10",
  },
  {
    id: "5",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "above",
    targetPrice: 150.0,
    currentPrice: 141.8,
    isActive: true,
    createdAt: "2024-02-05",
  },
]

export const triggeredAlerts: Alert[] = [
  {
    id: "t1",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "above",
    targetPrice: 175.0,
    currentPrice: 178.25,
    isActive: false,
    triggeredAt: "2 hours ago",
  },
  {
    id: "t2",
    symbol: "META",
    name: "Meta Platforms Inc.",
    type: "above",
    targetPrice: 320.0,
    currentPrice: 326.49,
    isActive: false,
    triggeredAt: "1 day ago",
  },
]

export const mockCompanyInfo: Record<string, CompanyInfo> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology",
    industry: "Consumer Electronics",
    ceo: "Tim Cook",
    employees: 164000,
    headquarters: "Cupertino, CA",
    founded: "1976",
    website: "https://apple.com",
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    description:
      "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    sector: "Technology",
    industry: "Software - Infrastructure",
    ceo: "Satya Nadella",
    employees: 221000,
    headquarters: "Redmond, WA",
    founded: "1975",
    website: "https://microsoft.com",
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    description:
      "NVIDIA Corporation provides graphics, compute, and networking solutions worldwide, including GPUs for gaming, data centers, and AI.",
    sector: "Technology",
    industry: "Semiconductors",
    ceo: "Jensen Huang",
    employees: 29600,
    headquarters: "Santa Clara, CA",
    founded: "1993",
    website: "https://nvidia.com",
  },
}

// Mock market indices
export const mockIndices: MarketIndex[] = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: 4515.77,
    change: 23.45,
    changePercent: 0.52,
  },
  {
    name: "NASDAQ",
    symbol: "IXIC",
    value: 14125.48,
    change: 87.32,
    changePercent: 0.62,
  },
  {
    name: "DOW JONES",
    symbol: "DJI",
    value: 35150.22,
    change: -45.67,
    changePercent: -0.13,
  },
]

// Mock news items
export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Apple Announces New AI Features for iPhone",
    summary:
      "Apple Inc. unveiled a suite of new artificial intelligence features during their annual developer conference, marking a significant push into the AI space.",
    source: "Bloomberg",
    publishedAt: "2 hours ago",
    category: "Technology",
    url: "#",
    relatedSymbols: ["AAPL"],
  },
  {
    id: "2",
    title: "NVIDIA Surpasses $1 Trillion Market Cap",
    summary:
      "NVIDIA Corporation became the latest tech giant to join the trillion-dollar club as demand for AI chips continues to surge.",
    source: "Reuters",
    publishedAt: "4 hours ago",
    category: "Markets",
    url: "#",
    relatedSymbols: ["NVDA"],
  },
  {
    id: "3",
    title: "Federal Reserve Signals Pause in Rate Hikes",
    summary:
      "The Federal Reserve indicated it may hold interest rates steady at its next meeting, citing improving inflation data.",
    source: "CNBC",
    publishedAt: "6 hours ago",
    category: "Economy",
    url: "#",
  },
]

// Mock chart data (30 days)
export const mockChartData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const basePrice = 175
  const variance = Math.sin(i * 0.3) * 10 + Math.random() * 5
  return {
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: basePrice + variance,
    volume: Math.floor(Math.random() * 50000000) + 20000000,
  }
})

export const MOCK_STOCKS = mockStocks
export const MARKET_INDICES = mockIndices
export const CHART_DATA = mockChartData

// Mock portfolio data
export const mockPortfolio: Portfolio = {
  totalValue: 125847.32,
  dayChange: 1234.56,
  dayChangePercent: 0.99,
  totalGain: 15847.32,
  totalGainPercent: 14.41,
}

// Navigation items
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portfolio", label: "Portfolio", icon: "Wallet" },
  { href: "/watchlist", label: "Watchlist", icon: "Star" },
  { href: "/alerts", label: "Alerts", icon: "Bell" },
  { href: "/news", label: "News", icon: "Newspaper" },
]

// Helper function to get stock by symbol
export function getStockBySymbol(symbol: string): WatchlistItem | undefined {
  return mockStocks.find((s) => s.symbol.toLowerCase() === symbol.toLowerCase())
}

// Helper function to get company info
export function getCompanyInfo(symbol: string): CompanyInfo | undefined {
  return mockCompanyInfo[symbol.toUpperCase()]
}
