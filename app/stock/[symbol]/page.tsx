import { getCompanyInfo, mockNews } from "@/lib/mock-data"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { StockDetailContent } from "@/components/stocks/stock-detail-content"
import { StockDetailSkeleton } from "@/components/stocks/stock-detail-skeleton"
import { fetchStockDetail, fetchStockCandles } from "@/lib/actions/stocks"

interface StockDetailPageProps {
  params: Promise<{ symbol: string }>
}

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { symbol } = await params

  return (
    <AppShell>
      <Suspense fallback={<StockDetailSkeleton />}>
        <StockDetailFetcher symbol={symbol.toUpperCase()} />
      </Suspense>
    </AppShell>
  )
}

async function StockDetailFetcher({ symbol }: { symbol: string }) {
  const [stockResult, chartResult] = await Promise.all([fetchStockDetail(symbol), fetchStockCandles(symbol, "1M")])

  if (!stockResult.data) {
    notFound()
  }

  const companyInfo = getCompanyInfo(symbol)

  return (
    <StockDetailContent
      stock={stockResult.data}
      companyInfo={companyInfo}
      initialChartData={chartResult.data || []}
      news={mockNews}
      isUsingMockData={stockResult.isUsingMockData}
    />
  )
}
