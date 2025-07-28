import { type NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"
import { DataMapper } from "@/lib/data-mappers"

export async function POST(request: NextRequest) {
  try {
    const { teamName, dataType, data } = await request.json()

    if (!teamName || !dataType || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Initialize Google Sheets service
    await googleSheetsService.initialize()

    // Get the appropriate sheet configuration
    const SHEETS_CONFIG = (await import("@/lib/google-sheets")).SHEETS_CONFIG
    const teamConfig = SHEETS_CONFIG[teamName]

    if (!teamConfig) {
      return NextResponse.json({ error: `No configuration found for team: ${teamName}` }, { status: 404 })
    }

    const sheetConfig = teamConfig[dataType]
    if (!sheetConfig) {
      return NextResponse.json({ error: `No ${dataType} configuration found for team: ${teamName}` }, { status: 404 })
    }

    // Map and write data to Google Sheets
    let sheetsData: any[][]

    switch (dataType) {
      case "projects":
        sheetsData = DataMapper.mapProjectsToSheets(data)
        break
      case "performance":
        sheetsData = DataMapper.mapPerformanceToSheets(data)
        break
      case "punctuality":
        // Extract member names from data
        const memberNames = new Set<string>()
        data.forEach((entry: any) => {
          Object.keys(entry).forEach((key) => {
            if (key !== "date") memberNames.add(key)
          })
        })
        sheetsData = DataMapper.mapPunctualityToSheets(data, Array.from(memberNames))
        break
      default:
        return NextResponse.json({ error: `Unsupported data type: ${dataType}` }, { status: 400 })
    }

    // Clear existing data and write new data
    await googleSheetsService.clearSheet(sheetConfig)
    if (sheetsData.length > 0) {
      await googleSheetsService.writeSheet(sheetConfig, sheetsData)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${dataType} data for ${teamName}`,
      recordsUpdated: sheetsData.length,
    })
  } catch (error) {
    console.error("Sync API error:", error)
    return NextResponse.json(
      {
        error: "Failed to sync data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamName = searchParams.get("team")
    const dataType = searchParams.get("type")

    if (!teamName || !dataType) {
      return NextResponse.json({ error: "Missing team or type parameter" }, { status: 400 })
    }

    // Initialize Google Sheets service
    await googleSheetsService.initialize()

    // Get the appropriate sheet configuration
    const SHEETS_CONFIG = (await import("@/lib/google-sheets")).SHEETS_CONFIG
    const teamConfig = SHEETS_CONFIG[teamName]

    if (!teamConfig) {
      return NextResponse.json({ error: `No configuration found for team: ${teamName}` }, { status: 404 })
    }

    const sheetConfig = teamConfig[dataType]
    if (!sheetConfig) {
      return NextResponse.json({ error: `No ${dataType} configuration found for team: ${teamName}` }, { status: 404 })
    }

    // Read data from Google Sheets
    const rawData = await googleSheetsService.readSheet(sheetConfig)

    // Map data to application format
    let mappedData: any[]

    switch (dataType) {
      case "projects":
        mappedData = DataMapper.mapProjectsFromSheets(rawData)
        break
      case "performance":
        mappedData = DataMapper.mapPerformanceFromSheets(rawData)
        break
      case "punctuality":
        mappedData = DataMapper.mapPunctualityFromSheets(rawData)
        break
      default:
        return NextResponse.json({ error: `Unsupported data type: ${dataType}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: mappedData,
      lastUpdated: new Date().toISOString(),
      recordCount: mappedData.length,
    })
  } catch (error) {
    console.error("Fetch API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
