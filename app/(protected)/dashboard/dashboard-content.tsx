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
      {/* Dashboard header with Clerk profile icon */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Riven
          </h1>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </header>

      {/* Dashboard content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here is your personalized dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Revenue", value: "$45,231.89", desc: "+20.1% from last month" },
              { title: "Subscriptions", value: "+2350", desc: "+180.1% from last month" },
              { title: "Sales", value: "+12,234", desc: "+19% from last month" },
              { title: "Active Now", value: "+573", desc: "+201 since last hour" }
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
