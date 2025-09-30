"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, ShoppingBag, Utensils, Car, Film, Package, TrendingUp, TrendingDown, Plus, Edit } from "lucide-react"
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

const expenseCategories = [
  {
    name: "Housing",
    amount: 2500,
    budget: 3000,
    icon: Home,
    color: "bg-blue-500",
    change: 15.4,
    trend: "up",
  },
  {
    name: "Food",
    amount: 3500,
    budget: 4000,
    icon: Utensils,
    color: "bg-orange-500",
    change: 8.2,
    trend: "down",
  },
  {
    name: "Shopping",
    amount: 4200,
    budget: 5000,
    icon: ShoppingBag,
    color: "bg-pink-500",
    change: 25.1,
    trend: "up",
  },
  {
    name: "Transportation",
    amount: 500,
    budget: 800,
    icon: Car,
    color: "bg-purple-500",
    change: 12.4,
    trend: "down",
  },
  {
    name: "Entertainment",
    amount: 800,
    budget: 1000,
    icon: Film,
    color: "bg-green-500",
    change: 15.4,
    trend: "down",
  },
  {
    name: "Others",
    amount: 6500,
    budget: 8000,
    icon: Package,
    color: "bg-gray-500",
    change: 23.2,
    trend: "up",
  },
]

const recentExpenses = [
  { name: "Whole Foods Market", category: "Food", amount: 127.5, date: "May 18, 2023", icon: Utensils },
  { name: "Amazon Purchase", category: "Shopping", amount: 89.99, date: "May 17, 2023", icon: ShoppingBag },
  { name: "Uber Ride", category: "Transportation", amount: 24.5, date: "May 17, 2023", icon: Car },
  { name: "Netflix Subscription", category: "Entertainment", amount: 19.99, date: "May 16, 2023", icon: Film },
  { name: "Target", category: "Shopping", amount: 156.32, date: "May 15, 2023", icon: ShoppingBag },
]

export function ExpensesPage() {
  const [categories, setCategories] = useState(expenseCategories)
  const [expenses, setExpenses] = useState(recentExpenses)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "",
    amount: "",
  })
  const { toast } = useToast()

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0)
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const expense = {
      name: newExpense.name,
      category: newExpense.category,
      amount: Number.parseFloat(newExpense.amount),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      icon: Utensils,
    }

    setExpenses([expense, ...expenses])

    setCategories(
      categories.map((cat) =>
        cat.name === newExpense.category ? { ...cat, amount: cat.amount + Number.parseFloat(newExpense.amount) } : cat,
      ),
    )

    setIsAddExpenseOpen(false)
    setNewExpense({ name: "", category: "", amount: "" })
    toast({
      title: "Expense Added",
      description: `${expense.name} - $${expense.amount.toFixed(2)}`,
    })
  }

  const handleUpdateBudget = (categoryName: string, newBudget: number) => {
    setCategories(categories.map((cat) => (cat.name === categoryName ? { ...cat, budget: newBudget } : cat)))
    setIsEditBudgetOpen(false)
    toast({
      title: "Budget Updated",
      description: `${categoryName} budget set to $${newBudget}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Expenses</h2>
          <p className="text-muted-foreground">Track and manage your spending</p>
        </div>
        <Button onClick={() => setIsAddExpenseOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
            <Progress value={(totalExpenses / totalBudget) * 100} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              ${totalExpenses.toLocaleString()} of ${totalBudget.toLocaleString()} budget used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${(totalBudget - totalExpenses).toLocaleString()}</div>
            <Progress value={((totalBudget - totalExpenses) / totalBudget) * 100} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              {(((totalBudget - totalExpenses) / totalBudget) * 100).toFixed(1)}% of budget remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              const percentage = (category.amount / category.budget) * 100
              return (
                <Card key={category.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${category.color}/10 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${category.color.replace("bg-", "text-")}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            ${category.amount} / ${category.budget}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs">
                          {category.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-red-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-green-500" />
                          )}
                          <span className={category.trend === "up" ? "text-red-500" : "text-green-500"}>
                            {category.change}%
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => {
                            setSelectedCategory(category.name)
                            setIsEditBudgetOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{percentage.toFixed(1)}% of budget used</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense, index) => {
              const Icon = expense.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{expense.name}</h4>
                      <p className="text-sm text-muted-foreground">{expense.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for adding new expense */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Record a new expense transaction</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="e.g., Grocery Shopping"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <select
                id="expense-category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing budget */}
      <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update the budget for {selectedCategory}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-amount">New Budget Amount</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="0.00"
                defaultValue={categories.find((c) => c.name === selectedCategory)?.budget}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateBudget(selectedCategory, Number.parseFloat((e.target as HTMLInputElement).value))
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBudgetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const input = document.getElementById("budget-amount") as HTMLInputElement
                handleUpdateBudget(selectedCategory, Number.parseFloat(input.value))
              }}
            >
              Update Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
