"use client"

import { useState, useEffect, useCallback } from "react"
import { googleSheetsService, SHEETS_CONFIG } from "@/lib/google-sheets"
import { DataMapper, type ProjectRow, type PerformanceRow, type PunctualityRow } from "@/lib/data-mappers"

export interface TeamData {
  projects: ProjectRow[]
  performance: PerformanceRow[]
  punctuality: PunctualityRow[]
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

export interface UseGoogleSheetsReturn {
  teamData: { [teamName: string]: TeamData }
  refreshTeamData: (teamName: string) => Promise<void>
  refreshAllData: () => Promise<void>
  updateProject: (teamName: string, project: ProjectRow) => Promise<void>
  addProject: (teamName: string, project: Omit<ProjectRow, "id">) => Promise<void>
  deleteProject: (teamName: string, projectId: string) => Promise<void>
  updatePerformance: (teamName: string, kpi: PerformanceRow) => Promise<void>
  addPerformance: (teamName: string, kpi: Omit<PerformanceRow, "id">) => Promise<void>
  updatePunctuality: (teamName: string, punctuality: PunctualityRow[]) => Promise<void>
  isInitialized: boolean
  globalError: string | null
}

export function useGoogleSheets(): UseGoogleSheetsReturn {
  const [teamData, setTeamData] = useState<{ [teamName: string]: TeamData }>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  // Initialize empty team data structure
  const initializeTeamData = useCallback(() => {
    const initialData: { [teamName: string]: TeamData } = {}

    Object.keys(SHEETS_CONFIG).forEach((teamName) => {
      initialData[teamName] = {
        projects: [],
        performance: [],
        punctuality: [],
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      }
    })

    setTeamData(initialData)
  }, [])

  // Update team data state
  const updateTeamData = useCallback((teamName: string, updates: Partial<TeamData>) => {
    setTeamData((prev) => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        ...updates,
        lastUpdated: new Date(),
      },
    }))
  }, [])

  // Fetch data for a specific team
  const refreshTeamData = useCallback(
    async (teamName: string) => {
      const config = SHEETS_CONFIG[teamName]
      if (!config) {
        console.error(`No configuration found for team: ${teamName}`)
        return
      }

      updateTeamData(teamName, { isLoading: true, error: null })

      try {
        // Fetch all data types in parallel
        const [projectsData, performanceData, punctualityData] = await Promise.all([
          googleSheetsService.readSheet(config.projects),
          googleSheetsService.readSheet(config.performance),
          googleSheetsService.readSheet(config.punctuality),
        ])

        // Map the data
        const projects = DataMapper.mapProjectsFromSheets(projectsData)
        const performance = DataMapper.mapPerformanceFromSheets(performanceData)
        const punctuality = DataMapper.mapPunctualityFromSheets(punctualityData)

        updateTeamData(teamName, {
          projects,
          performance,
          punctuality,
          isLoading: false,
          error: null,
        })

        console.log(`Successfully refreshed data for ${teamName}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        console.error(`Failed to refresh data for ${teamName}:`, error)

        updateTeamData(teamName, {
          isLoading: false,
          error: errorMessage,
        })
      }
    },
    [updateTeamData],
  )

  // Refresh all team data
  const refreshAllData = useCallback(async () => {
    setGlobalError(null)

    try {
      const refreshPromises = Object.keys(SHEETS_CONFIG).map((teamName) => refreshTeamData(teamName))

      await Promise.all(refreshPromises)
      console.log("Successfully refreshed all team data")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to refresh data"
      setGlobalError(errorMessage)
      console.error("Failed to refresh all data:", error)
    }
  }, [refreshTeamData])

  // Update a project
  const updateProject = useCallback(
    async (teamName: string, project: ProjectRow) => {
      const config = SHEETS_CONFIG[teamName]?.projects
      if (!config) throw new Error(`No project configuration for ${teamName}`)

      // Validate data
      const errors = DataMapper.validateProjectData(project)
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(", ")}`)
      }

      try {
        const currentProjects = teamData[teamName]?.projects || []
        const projectIndex = currentProjects.findIndex((p) => p.id === project.id)

        if (projectIndex === -1) {
          throw new Error("Project not found")
        }

        const updatedProjects = [...currentProjects]
        updatedProjects[projectIndex] = project

        // Update Google Sheets
        const sheetsData = DataMapper.mapProjectsToSheets(updatedProjects)
        await googleSheetsService.writeSheet(config, sheetsData)

        // Update local state
        updateTeamData(teamName, { projects: updatedProjects })

        console.log(`Successfully updated project ${project.id} for ${teamName}`)
      } catch (error) {
        console.error("Failed to update project:", error)
        throw error
      }
    },
    [teamData, updateTeamData],
  )

  // Add a new project
  const addProject = useCallback(
    async (teamName: string, projectData: Omit<ProjectRow, "id">) => {
      const config = SHEETS_CONFIG[teamName]?.projects
      if (!config) throw new Error(`No project configuration for ${teamName}`)

      const newProject: ProjectRow = {
        ...projectData,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }

      // Validate data
      const errors = DataMapper.validateProjectData(newProject)
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(", ")}`)
      }

      try {
        // Add to Google Sheets
        const newRow = DataMapper.mapProjectsToSheets([newProject])
        await googleSheetsService.appendToSheet(config, newRow)

        // Update local state
        const currentProjects = teamData[teamName]?.projects || []
        const updatedProjects = [...currentProjects, newProject]
        updateTeamData(teamName, { projects: updatedProjects })

        console.log(`Successfully added project ${newProject.id} for ${teamName}`)
      } catch (error) {
        console.error("Failed to add project:", error)
        throw error
      }
    },
    [teamData, updateTeamData],
  )

  // Delete a project
  const deleteProject = useCallback(
    async (teamName: string, projectId: string) => {
      const config = SHEETS_CONFIG[teamName]?.projects
      if (!config) throw new Error(`No project configuration for ${teamName}`)

      try {
        const currentProjects = teamData[teamName]?.projects || []
        const updatedProjects = currentProjects.filter((p) => p.id !== projectId)

        // Update Google Sheets by rewriting all data
        const sheetsData = DataMapper.mapProjectsToSheets(updatedProjects)
        await googleSheetsService.clearSheet(config)
        if (sheetsData.length > 0) {
          await googleSheetsService.writeSheet(config, sheetsData)
        }

        // Update local state
        updateTeamData(teamName, { projects: updatedProjects })

        console.log(`Successfully deleted project ${projectId} for ${teamName}`)
      } catch (error) {
        console.error("Failed to delete project:", error)
        throw error
      }
    },
    [teamData, updateTeamData],
  )

  // Update performance data
  const updatePerformance = useCallback(
    async (teamName: string, kpi: PerformanceRow) => {
      const config = SHEETS_CONFIG[teamName]?.performance
      if (!config) throw new Error(`No performance configuration for ${teamName}`)

      // Validate data
      const errors = DataMapper.validatePerformanceData(kpi)
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(", ")}`)
      }

      try {
        const currentPerformance = teamData[teamName]?.performance || []
        const kpiIndex = currentPerformance.findIndex((k) => k.id === kpi.id)

        if (kpiIndex === -1) {
          throw new Error("KPI not found")
        }

        const updatedPerformance = [...currentPerformance]
        updatedPerformance[kpiIndex] = kpi

        // Update Google Sheets
        const sheetsData = DataMapper.mapPerformanceToSheets(updatedPerformance)
        await googleSheetsService.writeSheet(config, sheetsData)

        // Update local state
        updateTeamData(teamName, { performance: updatedPerformance })

        console.log(`Successfully updated KPI ${kpi.id} for ${teamName}`)
      } catch (error) {
        console.error("Failed to update performance:", error)
        throw error
      }
    },
    [teamData, updateTeamData],
  )

  // Add new performance data
  const addPerformance = useCallback(
    async (teamName: string, kpiData: Omit<PerformanceRow, "id">) => {
      const config = SHEETS_CONFIG[teamName]?.performance
      if (!config) throw new Error(`No performance configuration for ${teamName}`)

      const newKpi: PerformanceRow = {
        ...kpiData,
        id: `kpi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }

      // Validate data
      const errors = DataMapper.validatePerformanceData(newKpi)
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(", ")}`)
      }

      try {
        // Add to Google Sheets
        const newRow = DataMapper.mapPerformanceToSheets([newKpi])
        await googleSheetsService.appendToSheet(config, newRow)

        // Update local state
        const currentPerformance = teamData[teamName]?.performance || []
        const updatedPerformance = [...currentPerformance, newKpi]
        updateTeamData(teamName, { performance: updatedPerformance })

        console.log(`Successfully added KPI ${newKpi.id} for ${teamName}`)
      } catch (error) {
        console.error("Failed to add performance:", error)
        throw error
      }
    },
    [teamData, updateTeamData],
  )

  // Update punctuality data
  const updatePunctuality = useCallback(
    async (teamName: string, punctuality: PunctualityRow[]) => {
      const config = SHEETS_CONFIG[teamName]?.punctuality
      if (!config) throw new Error(`No punctuality configuration for ${teamName}`)

      try {
        // Extract member names from the data
        const memberNames = new Set<string>()
        punctuality.forEach((entry) => {
          Object.keys(entry).forEach((key) => {
            if (key !== "date") memberNames.add(key)
          })
        })

        // Update Google Sheets
        const sheetsData = DataMapper.mapPunctualityToSheets(punctuality, Array.from(memberNames))
        await googleSheetsService.clearSheet(config)
        if (sheetsData.length > 0) {
          await googleSheetsService.writeSheet(config, sheetsData)
        }

        // Update local state
        updateTeamData(teamName, { punctuality })

        console.log(`Successfully updated punctuality data for ${teamName}`)
      } catch (error) {
        console.error("Failed to update punctuality:", error)
        throw error
      }
    },
    [updateTeamData],
  )

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        initializeTeamData()
        await googleSheetsService.initialize()
        setIsInitialized(true)
        await refreshAllData()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to initialize"
        setGlobalError(errorMessage)
        console.error("Failed to initialize Google Sheets integration:", error)
      }
    }

    initialize()
  }, [initializeTeamData, refreshAllData])

  return {
    teamData,
    refreshTeamData,
    refreshAllData,
    updateProject,
    addProject,
    deleteProject,
    updatePerformance,
    addPerformance,
    updatePunctuality,
    isInitialized,
    globalError,
  }
}
