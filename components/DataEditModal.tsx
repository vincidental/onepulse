"use client"

import { useState } from "react"
import { X, Save, AlertCircle } from "lucide-react"
import type { ProjectRow, PerformanceRow } from "@/lib/data-mappers"

interface DataEditModalProps {
  isOpen: boolean
  onClose: () => void
  data: ProjectRow | PerformanceRow | null
  type: "project" | "performance"
  onSave: (data: any) => Promise<void>
  teamName: string
}

export function DataEditModal({ isOpen, onClose, data, type, onSave, teamName }: DataEditModalProps) {
  const [formData, setFormData] = useState<any>(data || {})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save data")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const renderProjectForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Task</label>
        <input
          type="text"
          value={formData.task || ""}
          onChange={(e) => handleInputChange("task", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
          <select
            value={formData.priority || "D"}
            onChange={(e) => handleInputChange("priority", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="P0">P0 - Urgent</option>
            <option value="P1">P1 - High</option>
            <option value="D">D - Daily</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            value={formData.status || "Not started"}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Not started">Not Started</option>
            <option value="In progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked/At Risk">Blocked/At Risk</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Owner</label>
        <input
          type="text"
          value={formData.owner || ""}
          onChange={(e) => handleInputChange("owner", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter owner name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate || ""}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate || ""}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Progress</label>
        <input
          type="text"
          value={formData.progress || ""}
          onChange={(e) => handleInputChange("progress", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., 50% or 26% - 50%"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Milestone</label>
        <input
          type="text"
          value={formData.milestone || ""}
          onChange={(e) => handleInputChange("milestone", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter milestone description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea
          value={formData.notes || ""}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter additional notes"
        />
      </div>
    </div>
  )

  const renderPerformanceForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">KPI / OKR</label>
        <input
          type="text"
          value={formData.kpi || ""}
          onChange={(e) => handleInputChange("kpi", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter KPI name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Today Progress</label>
          <input
            type="number"
            value={formData.todayProgress || 0}
            onChange={(e) => handleInputChange("todayProgress", Number.parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Current progress"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Expected Target</label>
          <input
            type="number"
            value={formData.expectedTarget || 0}
            onChange={(e) => handleInputChange("expectedTarget", Number.parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Target value"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Responsible</label>
        <input
          type="text"
          value={formData.responsible || ""}
          onChange={(e) => handleInputChange("responsible", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Responsible person"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Shared?</label>
          <select
            value={formData.shared || "No"}
            onChange={(e) => handleInputChange("shared", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Shared With</label>
          <input
            type="text"
            value={formData.sharedWith || ""}
            onChange={(e) => handleInputChange("sharedWith", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Team name or N/A"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Accountable</label>
          <input
            type="text"
            value={formData.accountable || ""}
            onChange={(e) => handleInputChange("accountable", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="A/B/C/D"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Consult</label>
          <input
            type="text"
            value={formData.consult || ""}
            onChange={(e) => handleInputChange("consult", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="A/B/C/D"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Inform</label>
          <input
            type="text"
            value={formData.inform || ""}
            onChange={(e) => handleInputChange("inform", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="A/B/C/D"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
        <select
          value={formData.status || "Open"}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Open">Open</option>
          <option value="Progress">Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">
              {data ? "Edit" : "Add"} {type === "project" ? "Project" : "KPI"}
            </h2>
            <p className="text-sm text-purple-400">{teamName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {type === "project" ? renderProjectForm() : renderPerformanceForm()}

          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-500 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 rounded-md transition-colors"
          >
            <Save className={`w-4 h-4 ${isSaving ? "animate-pulse" : ""}`} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
