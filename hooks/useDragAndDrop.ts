"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface DragData {
  type: string
  data: any
}

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null)
  const [dropZone, setDropZone] = useState<string | null>(null)

  const handleDragStart = useCallback((type: string, data: any) => {
    setDraggedItem({ type, data })
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDropZone(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDragEnter = useCallback((zoneId: string) => {
    setDropZone(zoneId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropZone(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, zoneId: string, onDrop: (item: any, zone: string) => void) => {
      e.preventDefault()
      if (draggedItem) {
        onDrop(draggedItem.data, zoneId)
      }
      setDraggedItem(null)
      setDropZone(null)
    },
    [draggedItem],
  )

  return {
    draggedItem,
    dropZone,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  }
}
