import { Auth2 } from "@/components/ui/auth-02"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }
  return <Auth2 mode="sign-in" />
}
