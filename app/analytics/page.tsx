"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTask } from "@/lib/task-context"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { calculateTaskStats, calculateCategoryStats } from "@/lib/analytics-utils"
import { BarChart3, Target, CheckCircle2, Zap } from "lucide-react"

export default function AnalyticsPage() {
  const { tasks } = useTask()
  const { user } = useAuth()
  const stats = calculateTaskStats(tasks)
  const categoryStats = calculateCategoryStats(tasks)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-sm text-muted-foreground">Track and analyze your productivity over time</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="glass-card gradient-blue border-blue-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-pastel" />
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-pastel">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.activeTasks} active</p>
              </CardContent>
            </Card>

            <Card className="glass-card gradient-pink border-pink-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-pink-pastel" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-pastel">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.completionRate}% rate</p>
              </CardContent>
            </Card>

            <Card className="glass-card gradient-purple border-purple-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-pastel" />
                  Recurring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-pastel">{stats.recurringTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">Active habits</p>
              </CardContent>
            </Card>

            <Card className="glass-card gradient-green border-green-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-pastel" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-pastel">{categoryStats.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Task categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <AnalyticsCharts />
        </main>
      </div>
    </AuthGuard>
  )
}
