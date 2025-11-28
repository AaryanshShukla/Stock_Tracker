"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavItems } from "./nav-items"
import { SearchCommand } from "@/components/search-command"
import { useAuth } from "@/contexts/auth-context"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const getInitials = () => {
    if (!user) return "?"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  const handleSignOut = () => {
    signOut()
    router.push("/sign-in")
  }

  return (
    <header className="sticky top-0 z-50 w-full h-[60px] sm:h-[70px] bg-gray-800/95 backdrop-blur-sm border-b border-gray-600">
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 h-full">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-smooth"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center transition-opacity hover:opacity-80">
            <Image src="/hummus.png" alt="HUMMUS" width={130} height={30} className="h-6 sm:h-7 w-auto" priority />
          </Link>
        </div>

        {/* Center: Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center">
          <NavItems />
        </nav>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <div className="hidden xs:block">
            <SearchCommand />
          </div>

          {/* Market Status Badge - hidden on tablet and below */}
          <Badge
            variant="outline"
            className="hidden xl:flex border-teal-400/30 text-teal-400 bg-teal-400/10 transition-smooth hover:bg-teal-400/20"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
            Market Open
          </Badge>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-smooth h-9 w-9"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full" />
          </Button>

          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-smooth hover:ring-2 hover:ring-yellow-400/30"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-600">
                    <AvatarImage src={user.avatarUrl || "/public/hummus.png"} alt={user.firstName} />
                    <AvatarFallback className="bg-gray-700 text-gray-400 text-xs sm:text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-700 text-gray-400">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-400">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem
                  className="text-gray-400 focus:bg-gray-700 focus:text-gray-300 cursor-pointer transition-colors"
                  onClick={() => router.push("/settings")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-400 focus:bg-gray-700 focus:text-gray-300 cursor-pointer transition-colors"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem
                  className="text-red-500 focus:bg-gray-700 focus:text-red-400 cursor-pointer transition-colors"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/sign-in")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
