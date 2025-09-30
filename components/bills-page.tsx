"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, CheckCircle2, Clock, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const upcomingBills = [
  {
    id: 1,
    name: "Figma",
    description: "Figma - Monthly",
    amount: 150,
    dueDate: "May 15",
    status: "upcoming",
    category: "Software",
    lastCharge: "14 May, 2022",
  },
  {
    id: 2,
    name: "Adobe",
    description: "Adobe - Yearly",
    amount: 559,
    dueDate: "Jun 16",
    status: "upcoming",
    category: "Software",
    lastCharge: "17 Jun, 2023",
  },
  {
    id: 3,
    name: "Netflix",
    description: "Netflix - Monthly",
    amount: 19.99,
    dueDate: "May 20",
    status: "upcoming",
    category: "Entertainment",
    lastCharge: "20 Apr, 2023",
  },
  {
    id: 4,
    name: "Spotify",
    description: "Spotify Premium",
    amount: 9.99,
    dueDate: "May 25",
    status: "upcoming",
    category: "Entertainment",
    lastCharge: "25 Apr, 2023",
  },
]

const paidBills = [
  {
    id: 5,
    name: "Electric Bill",
    description: "City Power & Light",
    amount: 124.5,
    paidDate: "May 1, 2023",
    status: "paid",
    category: "Utilities",
  },
  {
    id: 6,
    name: "Internet",
    description: "Comcast Xfinity",
    amount: 89.99,
    paidDate: "May 3, 2023",
    status: "paid",
    category: "Utilities",
  },
  {
    id: 7,
    name: "Water Bill",
    description: "Municipal Water",
    amount: 45.0,
    paidDate: "May 5, 2023",
    status: "paid",
    category: "Utilities",
  },
]

export function BillsPage() {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "paid">("upcoming")
  const [upcomingBillsList, setUpcomingBillsList] = useState(upcomingBills)
  const [paidBillsList, setPaidBillsList] = useState(paidBills)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBill, setNewBill] = useState({
    name: "",
    description: "",
    amount: "",
    dueDate: "",
    category: "",
  })
  const { toast } = useToast()

  const totalUpcoming = upcomingBillsList.reduce((sum, bill) => sum + bill.amount, 0)

  const handlePayBill = (billId: number) => {
    const bill = upcomingBillsList.find((b) => b.id === billId)
    if (bill) {
      const paidBill = {
        ...bill,
        status: "paid" as const,
        paidDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      }
      setPaidBillsList([paidBill, ...paidBillsList])
      setUpcomingBillsList(upcomingBillsList.filter((b) => b.id !== billId))
      toast({
        title: "Bill Paid",
        description: `Successfully paid ${bill.name} - $${bill.amount.toFixed(2)}`,
      })
    }
  }

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const bill = {
      id: Date.now(),
      name: newBill.name,
      description: newBill.description || newBill.name,
      amount: Number.parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      status: "upcoming" as const,
      category: newBill.category || "Other",
      lastCharge: "N/A",
    }

    setUpcomingBillsList([...upcomingBillsList, bill])
    setIsAddDialogOpen(false)
    setNewBill({ name: "", description: "", amount: "", dueDate: "", category: "" })
    toast({
      title: "Bill Added",
      description: `${bill.name} has been added to upcoming bills`,
    })
  }

  const handleDeleteBill = (billId: number, isPaid: boolean) => {
    if (isPaid) {
      setPaidBillsList(paidBillsList.filter((b) => b.id !== billId))
    } else {
      setUpcomingBillsList(upcomingBillsList.filter((b) => b.id !== billId))
    }
    toast({
      title: "Bill Deleted",
      description: "Bill has been removed",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bills</h2>
          <p className="text-muted-foreground">Manage your recurring payments and bills</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bill
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upcoming</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalUpcoming.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{upcomingBillsList.length} bills due this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBillsList[0]?.dueDate || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{upcomingBillsList[0]?.name || "No bills"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidBillsList.length}</div>
            <p className="text-xs text-muted-foreground">All payments on time</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-border">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            selectedTab === "upcoming" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setSelectedTab("upcoming")}
        >
          Upcoming Bills
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${
            selectedTab === "paid" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setSelectedTab("paid")}
        >
          Payment History
        </Button>
      </div>

      {selectedTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingBillsList.map((bill) => (
            <Card key={bill.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{bill.name}</h3>
                    <p className="text-sm text-muted-foreground">{bill.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last Charge - {bill.lastCharge}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="outline" className="text-xs">
                    {bill.category}
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">${bill.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Due {bill.dueDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handlePayBill(bill.id)}>
                      Pay Now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBill(bill.id, false)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === "paid" && (
        <div className="space-y-4">
          {paidBillsList.map((bill) => (
            <Card key={bill.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{bill.name}</h3>
                    <p className="text-sm text-muted-foreground">{bill.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Paid on {bill.paidDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-200">
                    {bill.category}
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">${bill.amount.toFixed(2)}</p>
                    <p className="text-sm text-green-600">Paid</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBill(bill.id, true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bill</DialogTitle>
            <DialogDescription>Add a new bill to track upcoming payments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bill-name">Bill Name *</Label>
              <Input
                id="bill-name"
                placeholder="e.g., Netflix"
                value={newBill.name}
                onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-description">Description</Label>
              <Input
                id="bill-description"
                placeholder="e.g., Monthly subscription"
                value={newBill.description}
                onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bill-amount">Amount *</Label>
                <Input
                  id="bill-amount"
                  type="number"
                  placeholder="0.00"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-due">Due Date *</Label>
                <Input
                  id="bill-due"
                  placeholder="e.g., May 15"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-category">Category</Label>
              <Input
                id="bill-category"
                placeholder="e.g., Entertainment"
                value={newBill.category}
                onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBill}>Add Bill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
