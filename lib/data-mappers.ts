// Data mapping utilities for converting between Google Sheets and application data structures

export interface ProjectRow {
  id: string
  task: string
  priority: string
  owner: string
  status: string
  startDate: string
  endDate: string
  progress: string
  milestone: string
  notes: string
}

export interface PerformanceRow {
  id: string
  kpi: string
  responsible: string
  accountable: string
  consult: string
  inform: string
  shared: string
  sharedWith: string
  status: string
  todayProgress: number
  expectedTarget: number
}

export interface PunctualityRow {
  date: string
  [memberName: string]: string
}

export class DataMapper {
  // Map Google Sheets rows to Project objects
  static mapProjectsFromSheets(rows: any[][]): ProjectRow[] {
    return rows
      .filter((row) => row.length >= 9 && row[0]) // Filter out empty rows
      .map((row, index) => ({
        id: row[0] || `project-${index}`,
        task: row[1] || "",
        priority: row[2] || "D",
        owner: row[3] || "",
        status: row[4] || "Not started",
        startDate: row[5] || "",
        endDate: row[6] || "",
        progress: row[7] || "0%",
        milestone: row[8] || "",
        notes: row[9] || "",
      }))
  }

  // Map Project objects to Google Sheets rows
  static mapProjectsToSheets(projects: ProjectRow[]): any[][] {
    return projects.map((project) => [
      project.id,
      project.task,
      project.priority,
      project.owner,
      project.status,
      project.startDate,
      project.endDate,
      project.progress,
      project.milestone,
      project.notes,
    ])
  }

  // Map Google Sheets rows to Performance objects
  static mapPerformanceFromSheets(rows: any[][]): PerformanceRow[] {
    return rows
      .filter((row) => row.length >= 10 && row[0])
      .map((row, index) => ({
        id: row[0] || `kpi-${index}`,
        kpi: row[1] || "",
        responsible: row[2] || "",
        accountable: row[3] || "",
        consult: row[4] || "",
        inform: row[5] || "",
        shared: row[6] || "No",
        sharedWith: row[7] || "N/A",
        status: row[8] || "Open",
        todayProgress: Number.parseFloat(row[9]) || 0,
        expectedTarget: Number.parseFloat(row[10]) || 0,
      }))
  }

  // Map Performance objects to Google Sheets rows
  static mapPerformanceToSheets(performance: PerformanceRow[]): any[][] {
    return performance.map((kpi) => [
      kpi.id,
      kpi.kpi,
      kpi.responsible,
      kpi.accountable,
      kpi.consult,
      kpi.inform,
      kpi.shared,
      kpi.sharedWith,
      kpi.status,
      kpi.todayProgress,
      kpi.expectedTarget,
    ])
  }

  // Map Google Sheets rows to Punctuality objects
  static mapPunctualityFromSheets(rows: any[][]): PunctualityRow[] {
    if (rows.length === 0) return []

    // First row should contain headers (date, member names)
    const headers = rows[0] || []

    return rows
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => {
        const punctualityRow: PunctualityRow = { date: row[0] || "" }

        // Map each member's punctuality status
        headers.slice(1).forEach((memberName, index) => {
          if (memberName) {
            punctualityRow[memberName.toLowerCase()] = row[index + 1] || "Absent"
          }
        })

        return punctualityRow
      })
  }

  // Map Punctuality objects to Google Sheets rows
  static mapPunctualityToSheets(punctuality: PunctualityRow[], memberNames: string[]): any[][] {
    const headers = ["date", ...memberNames]
    const rows = [headers]

    punctuality.forEach((entry) => {
      const row = [entry.date]
      memberNames.forEach((member) => {
        row.push(entry[member.toLowerCase()] || "Absent")
      })
      rows.push(row)
    })

    return rows
  }

  // Validate data integrity
  static validateProjectData(project: Partial<ProjectRow>): string[] {
    const errors: string[] = []

    if (!project.task?.trim()) errors.push("Task is required")
    if (!project.owner?.trim()) errors.push("Owner is required")
    if (!["P0", "P1", "D"].includes(project.priority || "")) errors.push("Invalid priority")
    if (!["Not started", "In progress", "Completed", "Blocked/At Risk"].includes(project.status || "")) {
      errors.push("Invalid status")
    }

    return errors
  }

  static validatePerformanceData(kpi: Partial<PerformanceRow>): string[] {
    const errors: string[] = []

    if (!kpi.kpi?.trim()) errors.push("KPI name is required")
    if (!kpi.responsible?.trim()) errors.push("Responsible person is required")
    if (typeof kpi.todayProgress !== "number" || kpi.todayProgress < 0) {
      errors.push("Today progress must be a positive number")
    }
    if (typeof kpi.expectedTarget !== "number" || kpi.expectedTarget <= 0) {
      errors.push("Expected target must be a positive number")
    }

    return errors
  }
}
