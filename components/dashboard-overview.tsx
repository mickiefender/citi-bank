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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold">
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
                <span className="text-lg sm:text-xl font-bold">
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
                <span className="hidden sm:inline">Previous</span>
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
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goals</CardTitle>
            <span className="text-xs sm:text-sm text-muted-foreground">May, 2023</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl sm:text-3xl font-bold">$20,000</div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Target Achieved</span>
                <span className="font-medium">$12,500</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">This month Target</span>
                <span className="font-medium">$20,000</span>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex items-center justify-center">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
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
                    <span className="text-xl sm:text-2xl font-bold">12K</span>
                    <span className="text-xs text-muted-foreground">$20k</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">Target vs Achievement</div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bill</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => router.push("/dashboard/bills")}>
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3 w-3 sm:ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="text-center min-w-[40px] sm:min-w-[48px]">
                <div className="text-xs text-muted-foreground">May</div>
                <div className="text-xl sm:text-2xl font-bold">15</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base">Apple music</p>
                <p className="text-xs sm:text-sm font-semibold">Apple music - Family</p>
                <p className="text-xs text-muted-foreground">Last Charge - 12 August, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm sm:text-base">$37</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="text-center min-w-[40px] sm:min-w-[48px]">
                <div className="text-xs text-muted-foreground">Jun</div>
                <div className="text-xl sm:text-2xl font-bold">16</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-destructive rounded" />
                  <p className="font-medium text-sm sm:text-base">Netflix</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold">Netflix - Yearly</p>
                <p className="text-xs text-muted-foreground">Last Charge - 17 Jun, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm sm:text-base">$153</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Recent Transaction</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.push("/dashboard/transactions")}
            >
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3 w-3 sm:ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 border-b border-border overflow-x-auto">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none whitespace-nowrap ${selectedTransactionFilter === "all" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("all")}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground whitespace-nowrap ${selectedTransactionFilter === "revenue" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("revenue")}
              >
                Revenue
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground whitespace-nowrap ${selectedTransactionFilter === "expenses" ? "border-b-2 border-primary" : ""}`}
                onClick={() => setSelectedTransactionFilter("expenses")}
              >
                Expenses
              </Button>
            </div>

            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                      {transaction.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{transaction.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm sm:text-base">${transaction.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Statistics</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                Weekly Comparison
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end gap-2 sm:gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="hidden sm:inline">This week</span>
                <span className="sm:hidden">This</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-muted" />
                <span className="hidden sm:inline">Last week</span>
                <span className="sm:hidden">Last</span>
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
              className="h-[180px] sm:h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Expenses Breakdown</CardTitle>
          <span className="text-xs sm:text-sm text-muted-foreground">*Compare to last month</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {expensesBreakdown.map((expense) => (
              <div key={expense.name} className="flex flex-col gap-2 p-3 sm:p-4 rounded-lg border border-border">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg sm:text-xl">🏠</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">{expense.name}</p>
                  <p className="text-base sm:text-lg font-bold">${expense.amount.toFixed(2)}</p>
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
