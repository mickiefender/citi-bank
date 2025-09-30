import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpensesPage } from "@/components/expenses-page"

export default async function Expenses() {
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
      <ExpensesPage />
    </DashboardLayout>
  )
}
