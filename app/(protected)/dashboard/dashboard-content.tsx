"use client"

import { UserButton } from "@clerk/nextjs"
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect"

export default function DashboardContent() {
  const { isLoading, isAuthenticated } = useStoreUserEffect()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Dashboard content will go here */}
    </div>
  )
}
