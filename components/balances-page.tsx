"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACCOUNTS } from "@/lib/accounts"
import { CreditCard, PiggyBank, Landmark, FileText } from "lucide-react"

const accountIcons = {
  checking: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  cd: Landmark,
}

export function BalancesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Account Balances</h2>
        <p className="text-sm sm:text-base text-muted-foreground">View all your Citi Bank accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ACCOUNTS.map((account) => {
          const Icon = accountIcons[account.type as keyof typeof accountIcons] || FileText
          return (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">{account.name}</CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono text-xs sm:text-sm">{account.accountNumber}</span>
                </div>
                {account.limit && (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Credit Limit</span>
                    <span className="font-semibold">
                      ${account.limit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {account.type === "credit" && account.limit && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Available Credit</span>
                      <span>
                        ${(account.limit - account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${((account.limit - account.balance) / account.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
