"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Key, Brain, Target, Clock, Bell } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  userId: string
  geminiApiKey?: string
  preferredModel: 'gemini-flash-2.0' | 'gpt-4o-mini' | 'gemini-pro'
  aiSettings: {
    temperature: number
    maxTokens: number
    systemPersonality: 'helpful' | 'motivational' | 'analytical' | 'casual'
  }
  userGoals: string[]
  preferences: {
    taskCategories: string[]
    workingHours: { start: string; end: string }
    timezone: string
    notificationSettings: {
      taskReminders: boolean
      goalProgress: boolean
      aiInsights: boolean
    }
  }
}

export function UserProfileSettings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newGoal, setNewGoal] = useState("")
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile || !user) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, userId: user.id })
      })

      if (response.ok) {
        toast.success('Profile saved successfully!')
      } else {
        throw new Error('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const addGoal = () => {
    if (newGoal.trim() && profile) {
      setProfile({
        ...profile,
        userGoals: [...profile.userGoals, newGoal.trim()]
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        userGoals: profile.userGoals.filter((_, i) => i !== index)
      })
    }
  }

  const testApiKey = async () => {
    if (!profile?.geminiApiKey) {
      toast.error('Please enter a Gemini API key first')
      return
    }

    try {
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: profile.geminiApiKey })
      })

      if (response.ok) {
        toast.success('API key is valid!')
      } else {
        toast.error('API key is invalid')
      }
    } catch (error) {
      toast.error('Failed to test API key')
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-pastel" />
            AI Settings
          </CardTitle>
          <CardDescription>Loading your AI preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load profile settings</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Model Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-pastel" />
            AI Model Settings
          </CardTitle>
          <CardDescription>Configure your AI assistant preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row - Model and Personality */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="model" className="text-sm font-medium">Preferred AI Model</Label>
              <Select 
                value={profile.preferredModel} 
                onValueChange={(value: any) => setProfile({...profile, preferredModel: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-flash-2.0">Gemini Flash 2.0 (Recommended)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="personality" className="text-sm font-medium">AI Personality</Label>
              <Select 
                value={profile.aiSettings.systemPersonality} 
                onValueChange={(value: any) => setProfile({
                  ...profile, 
                  aiSettings: {...profile.aiSettings, systemPersonality: value}
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                  <SelectItem value="motivational">Motivational & Energetic</SelectItem>
                  <SelectItem value="analytical">Analytical & Data-driven</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Creativity and Response Length */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="temperature" className="text-sm font-medium">Creativity Level</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={profile.aiSettings.temperature}
                    onChange={(e) => setProfile({
                      ...profile,
                      aiSettings: {...profile.aiSettings, temperature: parseFloat(e.target.value)}
                    })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex justify-center">
                  <span className="text-sm font-medium text-purple-pastel">
                    Current: {profile.aiSettings.temperature}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxTokens" className="text-sm font-medium">Response Length</Label>
              <Select 
                value={profile.aiSettings.maxTokens.toString()} 
                onValueChange={(value) => setProfile({
                  ...profile,
                  aiSettings: {...profile.aiSettings, maxTokens: parseInt(value)}
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">Short (500 tokens)</SelectItem>
                  <SelectItem value="1000">Medium (1000 tokens)</SelectItem>
                  <SelectItem value="2000">Long (2000 tokens)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-pastel" />
            API Key Management
          </CardTitle>
          <CardDescription>Configure your Gemini API key for enhanced AI features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="apiKey" className="text-sm font-medium">Gemini API Key</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="apiKey"
                type={apiKeyVisible ? "text" : "password"}
                placeholder="Enter your Gemini API key"
                value={profile.geminiApiKey === '[CONFIGURED]' ? '' : profile.geminiApiKey || ''}
                onChange={(e) => setProfile({...profile, geminiApiKey: e.target.value})}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="flex-1 sm:flex-none"
                >
                  {apiKeyVisible ? 'Hide' : 'Show'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testApiKey}
                  disabled={!profile.geminiApiKey}
                  className="flex-1 sm:flex-none"
                >
                  Test
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your free API key from Google AI Studio
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Goals */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-pastel" />
            Personal Goals
          </CardTitle>
          <CardDescription>Set your long-term objectives for better AI assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              className="flex-1"
            />
            <Button onClick={addGoal} disabled={!newGoal.trim()} className="sm:w-auto w-full">
              Add Goal
            </Button>
          </div>
          
          <div className="space-y-2">
            {profile.userGoals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm">{goal}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-pastel" />
            Working Hours
          </CardTitle>
          <CardDescription>Set your preferred working hours for better task scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={profile.preferences.workingHours.start}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    workingHours: {...profile.preferences.workingHours, start: e.target.value}
                  }
                })}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={profile.preferences.workingHours.end}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    workingHours: {...profile.preferences.workingHours, end: e.target.value}
                  }
                })}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-pink-pastel" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what AI insights you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
              </div>
              <Switch
                checked={profile.preferences.notificationSettings.taskReminders}
                onCheckedChange={(checked) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notificationSettings: {
                      ...profile.preferences.notificationSettings,
                      taskReminders: checked
                    }
                  }
                })}
                className="sm:ml-auto"
              />
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Goal Progress Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates on your goal progress</p>
              </div>
              <Switch
                checked={profile.preferences.notificationSettings.goalProgress}
                onCheckedChange={(checked) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notificationSettings: {
                      ...profile.preferences.notificationSettings,
                      goalProgress: checked
                    }
                  }
                })}
                className="sm:ml-auto"
              />
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">AI Insights</Label>
                <p className="text-sm text-muted-foreground">Get productivity insights and suggestions</p>
              </div>
              <Switch
                checked={profile.preferences.notificationSettings.aiInsights}
                onCheckedChange={(checked) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notificationSettings: {
                      ...profile.preferences.notificationSettings,
                      aiInsights: checked
                    }
                  }
                })}
                className="sm:ml-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveProfile} 
          disabled={isSaving}
          className="bg-purple-pastel hover:bg-purple-pastel/90 text-white"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
