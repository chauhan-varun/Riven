import Navbar from "@/components/navbar"
import { auth } from "@clerk/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the Clerk token to securely fetch from Convex on the server
  const { getToken } = await auth()
  const token = (await getToken({ template: "convex" })) ?? undefined
  
  // Prefetch the user profile data
  const profile = token ? await fetchQuery(api.users.current, {}, { token }) : null

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </>
  )
}
