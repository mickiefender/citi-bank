"use client"

import type { User } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ACCOUNTS, getTotalBalance } from "@/lib/accounts"
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"

interface DashboardOverviewProps {
  user: User
}

const recentTransactions = [
  { id: "1", name: "Bank MC debited", category: "Bank dept", amount: 1000.0, date: "17 August 2025", icon: "💳" },
  
]

const weeklyData = [
  { day: "Sun", thisWeek: 200, lastWeek: 150 },
  { day: "Mon", thisWeek: 180, lastWeek: 120 },
  { day: "Tue", thisWeek: 150, lastWeek: 180 },
  { day: "Wed", thisWeek: 220, lastWeek: 200 },
  { day: "Thu", thisWeek: 190, lastWeek: 160 },
  { day: "Fri", thisWeek: 240, lastWeek: 210 },
  { day: "Sat", thisWeek: 210, lastWeek: 190 },
]

const expensesBreakdown = [
  { name: "Housing", amount: 250.0, percentage: 15, trend: "up" },
  { name: "Food", amount: 350.0, percentage: 8, trend: "down" },
  { name: "Transportation", amount: 50.0, percentage: 12, trend: "down" },
  { name: "Entertainment", amount: 80.0, percentage: 15, trend: "down" },
  { name: "Shopping", amount: 420.0, percentage: 25, trend: "up" },
  { name: "Others", amount: 650.0, percentage: 23, trend: "up" },
]

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const router = useRouter()
  const totalBalance = getTotalBalance()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedTransactionFilter, setSelectedTransactionFilter] = useState<"all" | "revenue" | "expenses">("all")

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => (prev === 0 ? ACCOUNTS.length - 1 : prev - 1))
  }

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev === ACCOUNTS.length - 1 ? 0 : prev + 1))
  }

  const currentAccount = ACCOUNTS[currentCardIndex]

  const filteredTransactions =
    selectedTransactionFilter === "all"
      ? recentTransactions
      : recentTransactions.filter((t) => (selectedTransactionFilter === "revenue" ? t.amount > 100 : t.amount < 100))

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-muted-foreground mt-1">All Accounts</p>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <div className="flex gap-1">
                  <div className="h-6 w-8 rounded bg-destructive/80" />
                  <div className="h-6 w-8 rounded bg-amber-500/80" />
                </div>
              </div>
              <div>
                <p className="text-sm opacity-90">{currentAccount.type}</p>
                <p className="text-xs opacity-75 mt-1">{currentAccount.accountNumber || "****0000"}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">
                  ${(currentAccount.limit || currentAccount.balance).toLocaleString()}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30"
                  onClick={() => router.push("/dashboard/balances")}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Button variant="ghost" size="sm" className="gap-1" onClick={handlePreviousCard}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {ACCOUNTS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index === currentCardIndex ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" className="gap-1" onClick={handleNextCard}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goals</CardTitle>
            <span className="text-sm text-muted-foreground">May, 2023</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$20,000</div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target Achieved</span>
                <span className="font-medium">$12,500</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This month Target</span>
                <span className="font-medium">$20,000</span>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                  <svg className="transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(12500 / 20000) * 314} 314`}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">$0</span>
                    <span className="text-2xl font-bold">12K</span>
                    <span className="text-xs text-muted-foreground">$20k</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">Target vs Achievement</div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bill</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => router.push("/dashboard/bills")}>
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="text-center min-w-[48px]">
                <div className="text-xs text-muted-foreground">May</div>
                <div className="text-2xl font-bold">15</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Spotify</p>
                <p className="text-sm font-semibold">Spotify - Family</p>
                <p className="text-xs text-muted-foreground">Last Charge - 14 August, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$19</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="text-center min-w-[48px]">
                <div className="text-xs text-muted-foreground">Jun</div>
                <div className="text-2xl font-bold">16</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-destructive rounded" />
                  <p className="font-medium">Adobe</p>
                </div>
                <p className="text-sm font-semibold">Adobe - Yearly</p>
                <p className="text-xs text-muted-foreground">Last Charge - 17 Jun, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$559</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transaction</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.push("/dashboard/transactions")}
            >
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 border-b border-border">
              <Button
                variant="ghost"
                className={`rounded-none ${selectedTransactionFilter === "all" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("all")}
              >
                All
              </Button>
              <Button
                variant="ghost"
                className={`text-muted-foreground ${selectedTransactionFilter === "revenue" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("revenue")}
              >
                Revenue
              </Button>
              <Button
                variant="ghost"
                className={`text-muted-foreground ${selectedTransactionFilter === "expenses" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("expenses")}
              >
                Expenses
              </Button>
            </div>

            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                Weekly Comparison
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>This week</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-muted" />
                <span>Last week</span>
              </div>
            </div>

            <ChartContainer
              config={{
                thisWeek: {
                  label: "This Week",
                  color: "hsl(var(--primary))",
                },
                lastWeek: {
                  label: "Last Week",
                  color: "hsl(var(--muted))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="thisWeek" fill="var(--color-thisWeek)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lastWeek" fill="var(--color-lastWeek)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expenses Breakdown</CardTitle>
          <span className="text-sm text-muted-foreground">*Compare to last month</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {expensesBreakdown.map((expense) => (
              <div key={expense.name} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xl">🏠</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">{expense.name}</p>
                  <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">{expense.percentage}%*</span>
                    {expense.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-destructive" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
