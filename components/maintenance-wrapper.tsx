"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MaintenancePage } from "@/components/maintenance-page"
import ApiService from "@/lib/api"

interface MaintenanceWrapperProps {
  children: React.ReactNode
}

export function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceDescription, setMaintenanceDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const setting = await ApiService.getPublicSettings()
        if (setting) {
          setIsMaintenanceMode(setting.technical_work || false)
          setMaintenanceDescription(setting.technical_description || "")
        }
      } catch (error) {
        console.error("Failed to check maintenance mode:", error)
        // If API fails, assume no maintenance mode
        setIsMaintenanceMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()
  }, [])

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Yuklanmoqda...</div>
      </div>
    )
  }

  // Show maintenance page if maintenance mode is enabled
  if (isMaintenanceMode) {
    return <MaintenancePage description={maintenanceDescription} />
  }

  // Show normal content
  return <>{children}</>
}
