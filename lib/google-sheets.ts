import { GoogleAuth } from "google-auth-library"
import { type sheets_v4, google } from "googleapis"

export interface SheetConfig {
  spreadsheetId: string
  sheetName: string
  range: string
}

export interface TeamSheetMapping {
  projects: SheetConfig
  performance: SheetConfig
  punctuality: SheetConfig
}

export interface GoogleSheetsConfig {
  [teamName: string]: TeamSheetMapping
}

// Configuration for each team's Google Sheets
export const SHEETS_CONFIG: GoogleSheetsConfig = {
  "Brand & Creative": {
    projects: {
      spreadsheetId: process.env.NEXT_PUBLIC_BRAND_CREATIVE_SHEET_ID || "",
      sheetName: "Projects",
      range: "A2:I1000",
    },
    performance: {
      spreadsheetId: process.env.NEXT_PUBLIC_BRAND_CREATIVE_SHEET_ID || "",
      sheetName: "Performance",
      range: "A2:J1000",
    },
    punctuality: {
      spreadsheetId: process.env.NEXT_PUBLIC_BRAND_CREATIVE_SHEET_ID || "",
      sheetName: "Punctuality",
      range: "A2:H1000",
    },
  },
  "Digital Marketing": {
    projects: {
      spreadsheetId: process.env.NEXT_PUBLIC_DIGITAL_MARKETING_SHEET_ID || "",
      sheetName: "Projects",
      range: "A2:I1000",
    },
    performance: {
      spreadsheetId: process.env.NEXT_PUBLIC_DIGITAL_MARKETING_SHEET_ID || "",
      sheetName: "Performance",
      range: "A2:J1000",
    },
    punctuality: {
      spreadsheetId: process.env.NEXT_PUBLIC_DIGITAL_MARKETING_SHEET_ID || "",
      sheetName: "Punctuality",
      range: "A2:H1000",
    },
  },
}

class GoogleSheetsService {
  private auth: GoogleAuth | null = null
  private sheets: sheets_v4.Sheets | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    try {
      // Initialize Google Auth with service account
      this.auth = new GoogleAuth({
        credentials: {
          type: "service_account",
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      this.sheets = google.sheets({ version: "v4", auth: this.auth })
      this.isInitialized = true
    } catch (error) {
      console.error("Failed to initialize Google Sheets service:", error)
      throw new Error("Google Sheets authentication failed")
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  async readSheet(config: SheetConfig): Promise<any[][]> {
    await this.ensureInitialized()

    try {
      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!${config.range}`,
      })

      return response.data.values || []
    } catch (error) {
      console.error(`Failed to read sheet ${config.sheetName}:`, error)
      throw new Error(`Failed to fetch data from ${config.sheetName}`)
    }
  }

  async writeSheet(config: SheetConfig, values: any[][]): Promise<void> {
    await this.ensureInitialized()

    try {
      await this.sheets!.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!${config.range}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      })
    } catch (error) {
      console.error(`Failed to write to sheet ${config.sheetName}:`, error)
      throw new Error(`Failed to update ${config.sheetName}`)
    }
  }

  async appendToSheet(config: SheetConfig, values: any[][]): Promise<void> {
    await this.ensureInitialized()

    try {
      await this.sheets!.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:Z`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      })
    } catch (error) {
      console.error(`Failed to append to sheet ${config.sheetName}:`, error)
      throw new Error(`Failed to add data to ${config.sheetName}`)
    }
  }

  async clearSheet(config: SheetConfig): Promise<void> {
    await this.ensureInitialized()

    try {
      await this.sheets!.spreadsheets.values.clear({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!${config.range}`,
      })
    } catch (error) {
      console.error(`Failed to clear sheet ${config.sheetName}:`, error)
      throw new Error(`Failed to clear ${config.sheetName}`)
    }
  }

  async batchUpdate(spreadsheetId: string, requests: sheets_v4.Schema$Request[]): Promise<void> {
    await this.ensureInitialized()

    try {
      await this.sheets!.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      })
    } catch (error) {
      console.error("Failed to perform batch update:", error)
      throw new Error("Failed to perform batch update")
    }
  }
}

export const googleSheetsService = new GoogleSheetsService()
