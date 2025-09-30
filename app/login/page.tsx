import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <LoginForm />
    </div>
  )
}
