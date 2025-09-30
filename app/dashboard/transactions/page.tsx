import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionPage } from "@/components/transaction-page"

export default async function TransactionsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={user}>
      <TransactionPage />
    </DashboardLayout>
  )
}
