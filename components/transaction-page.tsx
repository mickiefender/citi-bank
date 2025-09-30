"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ACCOUNTS } from "@/lib/accounts"
import { processTransaction } from "@/lib/transaction-actions"
import { AlertCircle, Ban } from "lucide-react"

export function TransactionPage() {
  const [fromAccount, setFromAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientBank, setRecipientBank] = useState("")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await processTransaction({
      fromAccountId: fromAccount,
      amount: Number.parseFloat(amount),
      recipientName,
      recipientBank,
      recipientAccount,
    })

    setLoading(false)

    if (result.blocked) {
      setIsBlocked(true)
      setError(null)
    } else if (!result.success) {
      setError(result.error || "Transaction failed")
    }
  }

  if (isBlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive" className="border-2">
          <Ban className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Account Blocked</AlertTitle>
          <AlertDescription className="mt-2">
            Your account has been temporarily blocked due to multiple failed transaction attempts. Please contact
            customer support <a href="mailto:citibankhelpcustomerservice@gmail.com">citibankhelpcustomerservice@gmail.com</a> or visit your nearest branch to resolve this issue.
          </AlertDescription>
        </Alert>
        <div className="mt-6 p-6 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-2">What happened?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For your security, we've blocked your account after detecting multiple suspicious transaction attempts. This
            is a standard security measure to protect your funds.
          </p>
          <h3 className="font-semibold mb-2">How to unlock your account:</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Call our 24/7 customer support line</li>
            <li>Visit any Citi Bank branch with valid ID</li>
            <li>Verify your identity through our secure verification process</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Send Money</h2>
        <p className="text-muted-foreground">Transfer funds to another bank account</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Transaction Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>Enter the details of your transfer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="from-account">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount} required>
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTS.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - ${account.balance.toLocaleString()} ({account.accountNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-semibold">Recipient Information</h3>

              <div className="space-y-2">
                <Label htmlFor="recipient-name">Recipient Name</Label>
                <Input
                  id="recipient-name"
                  placeholder="Enter recipient name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-bank">Recipient Bank</Label>
                <Input
                  id="recipient-bank"
                  placeholder="Enter bank name"
                  value={recipientBank}
                  onChange={(e) => setRecipientBank(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-account">Recipient Account Number</Label>
                <Input
                  id="recipient-account"
                  placeholder="Enter account number"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Processing..." : "Send Money"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFromAccount("")
                  setAmount("")
                  setRecipientName("")
                  setRecipientBank("")
                  setRecipientAccount("")
                  setError(null)
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Important Information</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Transfers to external banks may take 1-3 business days</li>
                <li>Daily transfer limit: $10,000</li>
                <li>For your security, large transactions may require additional verification</li>
                <li>Please verify recipient details before confirming the transfer</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
