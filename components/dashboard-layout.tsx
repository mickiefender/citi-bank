"use client"

import type React from "react"

import type { User } from "@/lib/auth"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  Receipt,
  TrendingUp,
  Target,
  Settings,
  LogOut,
  Bell,
  Search,
  Ban,
} from "lucide-react"
import { logout } from "@/lib/auth"
import { useEffect, useState } from "react"
import { checkAccountStatus } from "@/lib/transaction-actions"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutGrid },
  { name: "Balances", href: "/dashboard/balances", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Bills", href: "/dashboard/bills", icon: Receipt },
  { name: "Expenses", href: "/dashboard/expenses", icon: TrendingUp },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    checkAccountStatus().then((result) => {
      setIsBlocked(result.blocked)
    })
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Image src="/Citibank-logo.png" alt="Citi Bank Logo" width={90} height={100} className="rounded" />
           
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                onClick={() => router.push(item.href)}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">JA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">View profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Hello {user.name.split(" ")[0]}
                <span className="text-muted-foreground text-base ml-3">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search here" className="pl-10 bg-muted/50" />
              </div>
            </div>
          </div>
        </header>
        <div className="p-8">
          {isBlocked && (
            <Alert variant="destructive" className="mb-6">
              <Ban className="h-4 w-4" />
              <AlertTitle>Account Restricted</AlertTitle>
              <AlertDescription>
                Your account has been temporarily restricted. Some features may be unavailable. Please contact support <a href="mailto:citibankhelpcustomerservice@gmail.com">citibankhelpcustomerservice@gmail.com</a>
              </AlertDescription>
            </Alert>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
