"use client"

import { useTask } from "@/lib/task-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Zap, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRecurrenceLabel } from "@/lib/recurring-utils"

export function RecurringTasksSection() {
  const { getRecurringTasks, toggleTaskComplete, deleteTask } = useTask()
  const recurringTasks = getRecurringTasks()

  if (recurringTasks.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Recurring Tasks</CardTitle>
            <CardDescription>Your habits and repeating goals</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recurringTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
            >
              <button onClick={() => toggleTaskComplete(task.id)} className="flex-shrink-0">
                <CheckCircle2
                  className={`h-6 w-6 transition-colors ${
                    task.completed ? "text-primary fill-primary" : "text-muted-foreground"
                  }`}
                />
              </button>
              <div className="flex-1">
                <h3
                  className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.title}
                </h3>
                <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.time}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                    {formatRecurrenceLabel(task.recurring)}
                  </span>
                  {task.dueDate && <span className="text-xs">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{task.category}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
