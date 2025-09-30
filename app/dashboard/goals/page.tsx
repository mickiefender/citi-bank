import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalsPage } from "@/components/goals-page"

export default async function Goals() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/login")
  }

  const user = await getUser(sessionCookie.value)

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={user}>
      <GoalsPage />
    </DashboardLayout>
  )
}
