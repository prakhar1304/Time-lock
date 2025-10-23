"use client"

import { useTask } from "@/lib/task-context"
import {
  getHourSlots,
  getTasksForDateAndTime,
  getCategoryColor,
  getTaskStatusColor,
  getWeekDates,
} from "@/lib/calendar-utils"
import { Trash2, CheckCircle2 } from "lucide-react"

interface WeekViewProps {
  startDate: Date
}

export function WeekView({ startDate }: WeekViewProps) {
  const { tasks, toggleTaskComplete, deleteTask } = useTask()
  const hourSlots = getHourSlots()
  const weekDates = getWeekDates(startDate)

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="border border-border rounded-lg overflow-x-auto bg-card">
      <div className="grid gap-0" style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}>
        {/* Header - Time Column */}
        <div className="bg-muted p-4 font-semibold text-sm text-foreground border-b border-r border-border sticky left-0 z-10">
          Time
        </div>

        {/* Header - Day Columns */}
        {weekDates.map((date, idx) => (
          <div
            key={idx}
            className="bg-muted p-4 font-semibold text-sm text-foreground border-b border-r border-border text-center"
          >
            <div>{dayLabels[idx]}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        ))}

        {/* Time Slots */}
        {hourSlots.map((hour) => {
          const hourNum = Number.parseInt(hour.split(":")[0])

          return (
            <div key={hour} className="contents">
              {/* Time Label */}
              <div className="bg-muted/50 p-4 text-sm font-medium text-muted-foreground border-b border-r border-border sticky left-0 z-10 min-h-[100px] flex items-start">
                {hour}
              </div>

              {/* Day Cells */}
              {weekDates.map((date, dayIdx) => {
                const tasksInSlot = getTasksForDateAndTime(tasks, date, hourNum)

                return (
                  <div
                    key={`${hour}-${dayIdx}`}
                    className="p-2 border-b border-r border-border min-h-[100px] hover:bg-muted/30 transition-colors"
                  >
                    {tasksInSlot.length > 0 && (
                      <div className="space-y-1">
                        {tasksInSlot.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2 rounded text-xs border ${getCategoryColor(task.category)} ${getTaskStatusColor(task)} transition-all`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{task.title}</p>
                              </div>
                              <div className="flex gap-0.5 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleTaskComplete(task.id)
                                  }}
                                  className="p-0.5 hover:bg-black/10 rounded transition-colors"
                                >
                                  <CheckCircle2 className={`h-3 w-3 ${task.completed ? "fill-current" : ""}`} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTask(task.id)
                                  }}
                                  className="p-0.5 hover:bg-red-100 rounded transition-colors text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
