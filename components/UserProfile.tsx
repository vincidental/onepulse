"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { User, Settings, LogOut, ChevronDown, Mail, Briefcase, Users, X } from "lucide-react"

export function UserProfile() {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-purple-500"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.title}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                />
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.title}</p>
                  <p className="text-xs text-purple-400">{user.team}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Profile Settings</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-700 rounded-lg transition-colors text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                  Change Avatar
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">Full Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-gray-400">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.title}</p>
                    <p className="text-xs text-gray-400">Job Title</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.team}</p>
                    <p className="text-xs text-gray-400">Team</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
