"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Palette, Globe, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/hooks/use-settings"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { settings, isLoaded, updateNotification, updateAppearance, updateRegional } = useSettings()

  // Profile form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    updateUser({ firstName, lastName, phone })
    setIsSaving(false)
    setSaveSuccess(true)

    // Reset success state after 2 seconds
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const getInitials = () => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-400">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and app preferences.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Section */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <User className="h-5 w-5 text-yellow-400" />
              Profile
            </CardTitle>
            <CardDescription className="text-gray-500">Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-gray-600">
                <AvatarImage src={user?.avatarUrl || "/placeholder-user.png"} alt="User" />
                <AvatarFallback className="bg-gray-700 text-gray-400 text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent">
                  Change Avatar
                </Button>
              </div>
            </div>
            <Separator className="bg-gray-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-400">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Phone</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-gray-700 border-gray-600 text-gray-300 placeholder:text-gray-500"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-500">Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Price Alerts</p>
                <p className="text-sm text-gray-500">Get notified when stocks hit target prices</p>
              </div>
              <Switch
                checked={settings.notifications.priceAlerts}
                onCheckedChange={(checked) => updateNotification("priceAlerts", checked)}
              />
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Market News</p>
                <p className="text-sm text-gray-500">Daily market summaries and breaking news</p>
              </div>
              <Switch
                checked={settings.notifications.marketNews}
                onCheckedChange={(checked) => updateNotification("marketNews", checked)}
              />
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Portfolio Updates</p>
                <p className="text-sm text-gray-500">Weekly portfolio performance reports</p>
              </div>
              <Switch
                checked={settings.notifications.portfolioUpdates}
                onCheckedChange={(checked) => updateNotification("portfolioUpdates", checked)}
              />
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts via email</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateNotification("emailNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <Palette className="h-5 w-5 text-yellow-400" />
              Appearance
            </CardTitle>
            <CardDescription className="text-gray-500">Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Dark Mode</p>
                <p className="text-sm text-gray-500">Use dark theme across the app</p>
              </div>
              <Switch
                checked={settings.appearance.darkMode}
                onCheckedChange={(checked) => updateAppearance("darkMode", checked)}
              />
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Compact View</p>
                <p className="text-sm text-gray-500">Show more data in less space</p>
              </div>
              <Switch
                checked={settings.appearance.compactView}
                onCheckedChange={(checked) => updateAppearance("compactView", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Section */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <Globe className="h-5 w-5 text-yellow-400" />
              Regional
            </CardTitle>
            <CardDescription className="text-gray-500">Language and currency preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Language</Label>
                <Select value={settings.regional.language} onValueChange={(value) => updateRegional("language", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="English (UK)">English (UK)</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Currency</Label>
                <Select value={settings.regional.currency} onValueChange={(value) => updateRegional("currency", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="USD ($)">USD ($)</SelectItem>
                    <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                    <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                    <SelectItem value="JPY (¥)">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Timezone</Label>
                <Select value={settings.regional.timezone} onValueChange={(value) => updateRegional("timezone", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="Eastern Time (ET)">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Central Time (CT)">Central Time (CT)</SelectItem>
                    <SelectItem value="Mountain Time (MT)">Mountain Time (MT)</SelectItem>
                    <SelectItem value="Pacific Time (PT)">Pacific Time (PT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Date Format</Label>
                <Select
                  value={settings.regional.dateFormat}
                  onValueChange={(value) => updateRegional("dateFormat", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              Security
            </CardTitle>
            <CardDescription className="text-gray-500">Protect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent">
                Enable
              </Button>
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-400">Change Password</p>
                <p className="text-sm text-gray-500">Update your password regularly</p>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent">
                Update
              </Button>
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-500">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and data</p>
              </div>
              <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 bg-transparent">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
