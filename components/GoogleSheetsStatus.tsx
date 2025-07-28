"use client"

import { useState } from "react"
import { RefreshCw, AlertCircle, CheckCircle, Clock, Wifi, WifiOff } from "lucide-react"

interface GoogleSheetsStatusProps {
  isInitialized: boolean
  globalError: string | null
  teamData: { [teamName: string]: any }
  onRefresh: () => Promise<void>
}

export function GoogleSheetsStatus({ isInitialized, globalError, teamData, onRefresh }: GoogleSheetsStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const getConnectionStatus = () => {
    if (!isInitialized) return "initializing"
    if (globalError) return "error"

    const hasLoadingTeams = Object.values(teamData).some((team: any) => team.isLoading)
    if (hasLoadingTeams) return "loading"

    const hasErrors = Object.values(teamData).some((team: any) => team.error)
    if (hasErrors) return "partial-error"

    return "connected"
  }

  const status = getConnectionStatus()
  const lastUpdated = Object.values(teamData).reduce((latest: Date | null, team: any) => {
    if (!team.lastUpdated) return latest
    const teamDate = new Date(team.lastUpdated)
    return !latest || teamDate > latest ? teamDate : latest
  }, null)

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
      case "partial-error":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case "loading":
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
      case "initializing":
        return <WifiOff className="w-4 h-4 text-gray-400" />
      default:
        return <Wifi className="w-4 h-4 text-blue-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected to Google Sheets"
      case "error":
        return "Connection Error"
      case "partial-error":
        return "Partial Connection Issues"
      case "loading":
        return "Syncing Data..."
      case "initializing":
        return "Initializing..."
      default:
        return "Unknown Status"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-900 border-green-500"
      case "error":
      case "partial-error":
        return "bg-red-900 border-red-500"
      case "loading":
        return "bg-yellow-900 border-yellow-500"
      case "initializing":
        return "bg-gray-900 border-gray-500"
      default:
        return "bg-blue-900 border-blue-500"
    }
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <p className="text-sm font-medium text-white">{getStatusText()}</p>
          {lastUpdated && <p className="text-xs text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
          {globalError && <p className="text-xs text-red-400 mt-1">{globalError}</p>}
        </div>
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing || !isInitialized}
        className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded text-sm transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Syncing..." : "Sync"}
      </button>
    </div>
  )
}
