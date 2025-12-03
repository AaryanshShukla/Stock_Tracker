"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Newspaper, Settings, HelpCircle, X, Bell, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarIcon } from "@/components/icons/star-icon"

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/watchlist", label: "Watchlist", icon: "star" },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/news", label: "News", icon: Newspaper },
]

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/" || pathname === "/dashboard"
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Overlay for mobile - with fade transition */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 md:z-0",
          "h-screen w-[280px] sm:w-64",
          "bg-gray-800 border-r border-gray-600",
          "flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-600">
          <Link href="/dashboard" className="flex items-center" onClick={onClose}>
            <Image src="/logo.svg" alt="Signalist" width={120} height={28} className="h-6 w-auto" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-smooth"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map(({ href, label, icon }) => {
              const active = isActive(href)
              const Icon = icon === "star" ? null : icon
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      "transition-all duration-200 ease-out",
                      "active:scale-[0.98]",
                      active
                        ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 shadow-sm shadow-yellow-400/5"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-700/70",
                    )}
                  >
                    {icon === "star" ? (
                      <StarIcon className="h-5 w-5 flex-shrink-0" filled={active} />
                    ) : (
                      Icon && <Icon className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 sm:p-4 border-t border-gray-600">
          <ul className="space-y-1">
            {bottomItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      "transition-all duration-200 ease-out",
                      "active:scale-[0.98]",
                      active
                        ? "text-yellow-400 bg-yellow-400/10"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-700/70",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}
