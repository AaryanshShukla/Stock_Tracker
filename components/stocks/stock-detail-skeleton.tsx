import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StockDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40 bg-gray-700" />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-xl bg-gray-700" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32 bg-gray-700" />
              <Skeleton className="h-5 w-48 bg-gray-700" />
              <div className="flex items-center gap-4 mt-3">
                <Skeleton className="h-9 w-28 bg-gray-700" />
                <Skeleton className="h-8 w-32 bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 bg-gray-700" />
            <Skeleton className="h-10 w-36 bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Chart Skeleton */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-6 w-28 bg-gray-700" />
            <Skeleton className="h-10 w-64 bg-gray-700 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="h-[350px] w-full bg-gray-700 rounded-lg" />
        </CardContent>
      </Card>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                  <Skeleton className="h-5 w-24 bg-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Company Info & News Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16 bg-gray-700" />
                <Skeleton className="h-5 w-full bg-gray-700" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-600 lg:col-span-2">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-700/50">
                <Skeleton className="h-4 w-24 mb-2 bg-gray-600" />
                <Skeleton className="h-5 w-3/4 mb-2 bg-gray-600" />
                <Skeleton className="h-4 w-full bg-gray-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
