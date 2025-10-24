"use client"

import { useTask } from "@/lib/task-context"
import { getHourSlots, getTasksForDateAndTime, getCategoryColor, getTaskStatusColor } from "@/lib/calendar-utils"
import { Trash2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface TimeBlockingGridProps {
  date: Date
  onTaskClick?: (task: any) => void
}

export function TimeBlockingGrid({ date, onTaskClick }: TimeBlockingGridProps) {
  const { tasks, toggleTaskComplete, deleteTask } = useTask()
  const hourSlots = getHourSlots()
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {/* Time Grid */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="grid grid-cols-[100px_1fr] gap-0">
          {/* Header */}
          <div className="bg-muted p-4 font-semibold text-sm text-foreground border-b border-r border-border">Time</div>
          <div className="bg-muted p-4 font-semibold text-sm text-foreground border-b border-border">Tasks</div>

          {/* Time Slots */}
          {hourSlots.map((hour) => {
            const hourNum = Number.parseInt(hour.split(":")[0])
            const tasksInSlot = getTasksForDateAndTime(tasks, date, hourNum)

            return (
              <div key={hour} className="contents">
                <div className="bg-muted/50 p-4 text-sm font-medium text-muted-foreground border-b border-r border-border min-h-[120px] flex items-start">
                  {hour}
                </div>
                <div
                  className="p-4 border-b border-border min-h-[120px] hover:bg-muted/30 transition-colors cursor-pointer relative group"
                  onClick={() => setSelectedHour(hourNum)}
                >
                  {tasksInSlot.length > 0 ? (
                    <div className="space-y-2">
                      {tasksInSlot.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-md border-2 ${getCategoryColor(task.category)} ${getTaskStatusColor(task)} transition-all hover:shadow-md cursor-pointer`}
                          onClick={() => onTaskClick?.(task)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate font-semibold">
                                {task.title || 'Untitled Task'}
                              </h4>
                              <p className="text-xs font-medium opacity-80 mt-1">
                                {task.category || 'Uncategorized'}
                              </p>
                              {task.time && (
                                <p className="text-xs opacity-70 mt-1">
                                  {task.time}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleTaskComplete(task.id)
                                }}
                                className="p-1 hover:bg-black/20 rounded transition-colors"
                              >
                                <CheckCircle2 className={`h-4 w-4 ${task.completed ? "fill-current text-green-600" : "text-gray-600"}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteTask(task.id)
                                }}
                                className="p-1 hover:bg-red-200 rounded transition-colors text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to add task
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
