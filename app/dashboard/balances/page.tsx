import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BalancesPage } from "@/components/balances-page"

export default async function Balances() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={user}>
      <BalancesPage />
    </DashboardLayout>
  )
}
