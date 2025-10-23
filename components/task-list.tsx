"use client"

import { useTask } from "@/lib/task-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Zap, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategoryColor } from "@/lib/calendar-utils"

export function TaskList() {
  const { tasks, toggleTaskComplete, deleteTask } = useTask()

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>No tasks yet. Create one to get started!</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-pastel" />
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              {tasks.filter((t) => !t.completed).length} active, {tasks.filter((t) => t.completed).length} completed
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors glass-card ${getCategoryColor(task.category)}`}
            >
              <button onClick={() => toggleTaskComplete(task.id)} className="shrink-0">
                <CheckCircle2
                  className={`h-6 w-6 transition-colors ${
                    task.completed ? "text-green-pastel fill-green-pastel" : "text-muted-foreground"
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
                    {task.recurring}
                  </span>
                  {task.dueDate && <span className="text-xs">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{task.category}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="text-orange-pastel hover:text-orange-pastel hover:bg-orange-pastel/10"
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
