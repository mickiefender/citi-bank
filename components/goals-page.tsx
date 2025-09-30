"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, Plane, GraduationCap, Car, Sparkles, Plus, Trash2 } from "lucide-react"
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

const goals = [
  {
    id: 1,
    name: "Dream House",
    description: "Down payment for new home",
    target: 200000,
    current: 125000,
    icon: Home,
    color: "bg-blue-500",
    deadline: "Dec 2025",
  },
  {
    id: 2,
    name: "World Tour",
    description: "6-month travel adventure",
    target: 50000,
    current: 32000,
    icon: Plane,
    color: "bg-orange-500",
    deadline: "Jun 2024",
  },
  {
    id: 3,
    name: "Education Fund",
    description: "Children's college fund",
    target: 100000,
    current: 45000,
    icon: GraduationCap,
    color: "bg-purple-500",
    deadline: "Sep 2030",
  },
  {
    id: 4,
    name: "New Car",
    description: "Tesla Model 3",
    target: 45000,
    current: 38000,
    icon: Car,
    color: "bg-green-500",
    deadline: "Mar 2024",
  },
  {
    id: 5,
    name: "Emergency Fund",
    description: "6 months expenses",
    target: 30000,
    current: 30000,
    icon: Sparkles,
    color: "bg-pink-500",
    deadline: "Completed",
  },
]

export function GoalsPage() {
  const [goalsList, setGoalsList] = useState(goals)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null)
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    target: "",
    deadline: "",
  })
  const [fundsAmount, setFundsAmount] = useState("")
  const { toast } = useToast()

  const totalTarget = goalsList.reduce((sum, goal) => sum + goal.target, 0)
  const totalCurrent = goalsList.reduce((sum, goal) => sum + goal.current, 0)
  const completedGoals = goalsList.filter((goal) => goal.current >= goal.target).length

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      description: newGoal.description || newGoal.name,
      target: Number.parseFloat(newGoal.target),
      current: 0,
      icon: Sparkles,
      color: "bg-blue-500",
      deadline: newGoal.deadline,
    }

    setGoalsList([...goalsList, goal])
    setIsAddGoalOpen(false)
    setNewGoal({ name: "", description: "", target: "", deadline: "" })
    toast({
      title: "Goal Created",
      description: `${goal.name} has been added to your goals`,
    })
  }

  const handleAddFunds = () => {
    if (!fundsAmount || !selectedGoalId) return

    const amount = Number.parseFloat(fundsAmount)
    setGoalsList(
      goalsList.map((goal) =>
        goal.id === selectedGoalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
      ),
    )

    const goal = goalsList.find((g) => g.id === selectedGoalId)
    setIsAddFundsOpen(false)
    setFundsAmount("")
    setSelectedGoalId(null)
    toast({
      title: "Funds Added",
      description: `Added $${amount.toFixed(2)} to ${goal?.name}`,
    })
  }

  const handleDeleteGoal = (goalId: number) => {
    const goal = goalsList.find((g) => g.id === goalId)
    setGoalsList(goalsList.filter((g) => g.id !== goalId))
    toast({
      title: "Goal Deleted",
      description: `${goal?.name} has been removed`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Financial Goals</h2>
          <p className="text-muted-foreground">Track your savings goals and milestones</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddGoalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalCurrent / totalTarget) * 100).toFixed(1)}%</div>
            <Progress value={(totalCurrent / totalTarget) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              ${totalCurrent.toLocaleString()} of ${totalTarget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsList.length - completedGoals}</div>
            <p className="text-xs text-muted-foreground mt-2">Goals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}</div>
            <p className="text-xs text-muted-foreground mt-2">Goals achieved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goalsList.map((goal) => {
          const Icon = goal.icon
          const percentage = (goal.current / goal.target) * 100
          const isCompleted = goal.current >= goal.target

          return (
            <Card key={goal.id} className={isCompleted ? "border-green-500/50 bg-green-500/5" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg ${goal.color}/10 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${goal.color.replace("bg-", "text-")}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {isCompleted && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive h-7 w-7 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-foreground">${goal.current.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">of ${goal.target.toLocaleString()}</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-foreground">{percentage.toFixed(1)}% Complete</span>
                    <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                  </div>
                </div>
                {!isCompleted && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Edit Goal
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedGoalId(goal.id)
                        setIsAddFundsOpen(true)
                      }}
                    >
                      Add Funds
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>Set a new financial goal to track your savings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name *</Label>
              <Input
                id="goal-name"
                placeholder="e.g., Emergency Fund"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Description</Label>
              <Input
                id="goal-description"
                placeholder="e.g., 6 months expenses"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount *</Label>
                <Input
                  id="goal-target"
                  type="number"
                  placeholder="0.00"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Deadline *</Label>
                <Input
                  id="goal-deadline"
                  placeholder="e.g., Dec 2025"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>Add money to {goalsList.find((g) => g.id === selectedGoalId)?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="funds-amount">Amount</Label>
              <Input
                id="funds-amount"
                type="number"
                placeholder="0.00"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFundsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFunds}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
