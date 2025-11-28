import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded", className)} />
}

export function SkeletonStockTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header - hidden on mobile */}
      <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-4 w-20" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-3 border-t border-gray-700"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <Shimmer className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="space-y-2 min-w-0">
              <Shimmer className="h-4 w-16 sm:w-24" />
              <Shimmer className="h-3 w-12 hidden sm:block" />
            </div>
          </div>
          <Shimmer className="h-4 w-14 sm:w-16 self-center" />
          <Shimmer className="h-4 w-12 sm:w-14 self-center" />
          <Shimmer className="h-4 w-16 self-center hidden sm:block" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonMarketCard() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Shimmer className="h-4 w-16 sm:w-20" />
          <Shimmer className="h-6 w-14 rounded-full" />
        </div>
        <Shimmer className="h-7 w-24 sm:w-28 mb-2" />
        <Shimmer className="h-4 w-14 sm:w-16" />
      </CardContent>
    </Card>
  )
}

export function SkeletonChart() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Shimmer className="h-12 w-12 rounded-xl flex-shrink-0" />
            <div className="space-y-2">
              <Shimmer className="h-5 w-24 sm:w-32" />
              <Shimmer className="h-7 w-20 sm:w-28" />
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Shimmer key={i} className="h-8 w-10 rounded flex-shrink-0" />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Shimmer className="h-[250px] sm:h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function SkeletonStockCard() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Shimmer className="h-10 w-10 rounded-lg" />
          <Shimmer className="h-6 w-6 rounded" />
        </div>
        <Shimmer className="h-4 w-20 sm:w-24 mb-2" />
        <Shimmer className="h-5 w-16 sm:w-20 mb-1" />
        <Shimmer className="h-4 w-14 sm:w-16" />
      </CardContent>
    </Card>
  )
}

export function SkeletonPortfolioCard() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <Shimmer className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Shimmer className="h-8 w-36 sm:w-48" />
          <div className="flex items-center gap-4">
            <Shimmer className="h-5 w-24" />
            <Shimmer className="h-4 w-12" />
          </div>
          <div className="pt-2 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-28" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonAlertCard() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shimmer className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-8 w-12 rounded" />
            <Shimmer className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
