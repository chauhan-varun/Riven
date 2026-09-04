import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LandingPage from "@/components/LandingPage"
const page = async () => {
  const { userId } = await auth()
  if (userId) {
    redirect("/dashboard")
  }
  return <LandingPage />
}

export default page
