"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTask } from "@/lib/task-context"
import { useAuth } from "@/lib/auth-context"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskList } from "@/components/task-list"
import { RecurringTasksSection } from "@/components/recurring-tasks-section"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"

export default function Home() {
  const { tasks } = useTask()
  const { user } = useAuth()
  const completedCount = tasks.filter((t) => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const recurringCount = tasks.filter((t) => t.recurring !== "once" && !t.parentTaskId).length

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Greeting Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Good morning,</h1>
                <p className="text-lg text-muted-foreground">{user?.name || "User"}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-pastel text-white">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">12 days</span>
                </div>
                <CreateTaskDialog />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="glass-card gradient-blue border-blue-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-pastel">{tasks.filter((t) => !t.parentTaskId).length}</div>
                <p className="text-xs text-muted-foreground">
                  {tasks.filter((t) => !t.completed && !t.parentTaskId).length} active
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card gradient-pink border-pink-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-pastel">{completedCount}</div>
                <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
              </CardContent>
            </Card>

            <Card className="glass-card gradient-purple border-purple-pastel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground">Recurring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-pastel">{recurringCount}</div>
                <p className="text-xs text-muted-foreground">Active habits</p>
              </CardContent>
            </Card>
          </div>

          {/* Recurring Tasks Section */}
          <div className="mb-8">
            <RecurringTasksSection />
          </div>

          {/* Task List */}
          <TaskList />
        </main>
      </div>
    </AuthGuard>
  )
}
