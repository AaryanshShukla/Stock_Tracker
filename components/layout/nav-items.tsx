"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/mock-data"
import { LayoutDashboard, Search, Newspaper, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarIcon } from "@/components/icons/star-icon"

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Search,
  Newspaper,
  Bell,
}

export function NavItems() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/" || pathname === "/dashboard"
    return pathname.startsWith(path)
  }

  return (
    <ul className="flex items-center gap-1">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const Icon = iconMap[icon]
        const active = isActive(href)
        const isWatchlist = icon === "Star"

        return (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                active ? "text-yellow-400 bg-yellow-400/10" : "text-gray-500 hover:text-gray-400 hover:bg-gray-700",
              )}
            >
              {isWatchlist ? <StarIcon className="h-4 w-4" filled={active} /> : Icon && <Icon className="h-4 w-4" />}
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
