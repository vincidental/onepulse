"use client"

import { useState } from "react"
import { Menu, X, Bell, Search, Globe } from "lucide-react"
import { UserProfile } from "./UserProfile"

interface HeaderProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  activeTab: string
}

export function Header({ isSidebarOpen, toggleSidebar, activeTab }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getPageTitle = () => {
    switch (activeTab) {
      case "Leadership":
        return "Leadership Huddle"
      case "Initiatives":
        return "Initiatives & Projects"
      case "TeamHuddles":
        return "Team Huddles"
      case "Knowledge":
        return "Knowledge Base"
      case "People":
        return "People & Organization"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between relative z-40">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <img src="/images/foom-logo.png" alt="FOOM" className="h-6 invert" />
            <img src="/images/one-pulse-logo.png" alt="ONE Pulse" className="h-8" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
            <p className="text-xs text-gray-400">Real-time organizational intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, people, or data..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Language/Region */}
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Globe className="w-5 h-5 text-gray-400" />
        </button>

        {/* User Profile */}
        <UserProfile />
      </div>
    </header>
  )
}
