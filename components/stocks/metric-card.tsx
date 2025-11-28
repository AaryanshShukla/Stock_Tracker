"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  change?: string
  description?: string
  className?: string
}

export function MetricCard({ label, value, icon: Icon, trend, change, description, className }: MetricCardProps) {
  return (
    <Card className={cn("bg-gray-800 border-gray-600", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span className="text-sm">{label}</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-xl font-bold text-gray-400">{value}</p>
          {trend && (
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend === "up" && "text-teal-400",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-gray-500",
              )}
            >
              {trend === "up" && <TrendingUp className="h-4 w-4" />}
              {trend === "down" && <TrendingDown className="h-4 w-4" />}
              {trend === "neutral" && <Minus className="h-4 w-4" />}
              {change}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
