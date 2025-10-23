"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTask } from "@/lib/task-context"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { CalendarHeader } from "@/components/calendar-header"
import { TimeBlockingGrid } from "@/components/time-blocking-grid"
import { WeekView } from "@/components/week-view"
import { CreateTaskDialog } from "@/components/create-task-dialog"

export default function CalendarPage() {
  const { user } = useAuth()
  const { tasks } = useTask()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("day")

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const tasksForDate = tasks.filter((task) => {
    const taskDate = task.dueDate ? task.dueDate.split("T")[0] : new Date().toISOString().split("T")[0]
    const currentDateStr = currentDate.toISOString().split("T")[0]
    return taskDate === currentDateStr && !task.parentTaskId
  })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
                <p className="text-sm text-muted-foreground">Time-blocking view for your tasks</p>
              </div>
              <CreateTaskDialog />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Calendar Header with Navigation */}
          <CalendarHeader
            date={currentDate}
            viewMode={viewMode}
            onPreviousClick={handlePrevious}
            onTodayClick={handleToday}
            onNextClick={handleNext}
            onViewModeChange={setViewMode}
          />

          {/* Stats Card */}
          <Card className="mb-6 glass-card gradient-purple border-purple-pastel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                {viewMode === "day" ? "Today's Schedule" : "Weekly Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-pastel">{tasksForDate.length}</div>
              <p className="text-xs text-muted-foreground">
                {tasksForDate.filter((t) => !t.completed).length} active tasks
              </p>
            </CardContent>
          </Card>

          {/* Time Blocking Grid */}
          {viewMode === "day" ? <TimeBlockingGrid date={currentDate} /> : <WeekView startDate={currentDate} />}

        </main>
      </div>
    </AuthGuard>
  )
}
