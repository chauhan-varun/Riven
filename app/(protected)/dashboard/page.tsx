import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardContent from "./dashboard-content"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth/sign-in")
  }

  return <DashboardContent />
}
