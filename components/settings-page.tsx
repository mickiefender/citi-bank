"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, Globe } from "lucide-react"
import type { User as UserType } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface SettingsPageProps {
  user: UserType
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: "",
    address: "",
  })
  const [notifications, setNotifications] = useState({
    transactions: true,
    bills: true,
    marketing: false,
    security: true,
  })
  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "English (US)",
    currency: "USD ($)",
  })
  const { toast } = useToast()

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    })
  }

  const handleUpdatePassword = () => {
    const currentPassword = (document.getElementById("current-password") as HTMLInputElement)?.value
    const newPassword = (document.getElementById("new-password") as HTMLInputElement)?.value
    const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement)?.value

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              onCheckedChange={(checked) => {
                toast({
                  title: checked ? "2FA Enabled" : "2FA Disabled",
                  description: checked
                    ? "Two-factor authentication has been enabled"
                    : "Two-factor authentication has been disabled",
                })
              }}
            />
          </div>
          <Button onClick={handleUpdatePassword}>Update Password</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Transaction Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about all transactions</p>
            </div>
            <Switch
              checked={notifications.transactions}
              onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bill Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive reminders for upcoming bills</p>
            </div>
            <Switch
              checked={notifications.bills}
              onCheckedChange={(checked) => setNotifications({ ...notifications, bills: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about security events</p>
            </div>
            <Switch
              checked={notifications.security}
              onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>Customize your banking experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => {
                setPreferences({ ...preferences, darkMode: checked })
                toast({
                  title: checked ? "Dark Mode Enabled" : "Dark Mode Disabled",
                  description: "Theme preference updated",
                })
              }}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            >
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Linked Accounts</CardTitle>
          </div>
          <CardDescription>Manage your connected bank accounts and cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Citi Master Card</p>
                <p className="text-sm text-muted-foreground">•••• 2598</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            + Add New Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
