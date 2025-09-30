import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={user}>
      <DashboardOverview user={user} />
    </DashboardLayout>
  )
}
