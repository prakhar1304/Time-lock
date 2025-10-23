export function getHourSlots(): string[] {
  const slots: string[] = []
  for (let i = 6; i <= 23; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`)
  }
  return slots
}

export function getTasksForDate(tasks: any[], date: Date): any[] {
  const dateStr = date.toISOString().split("T")[0]
  return tasks.filter((task) => {
    const taskDate = task.dueDate ? task.dueDate.split("T")[0] : new Date().toISOString().split("T")[0]
    return taskDate === dateStr && !task.parentTaskId
  })
}

export function getTasksForDateAndTime(tasks: any[], date: Date, hour: number): any[] {
  const tasksForDate = getTasksForDate(tasks, date)
  return tasksForDate.filter((task) => {
    const taskHour = Number.parseInt(task.time.split(":")[0])
    return taskHour === hour
  })
}

export function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
}

export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)
  current.setDate(current.getDate() - current.getDay())

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Work: "bg-blue-pastel border-blue-pastel text-blue-pastel",
    Study: "bg-purple-pastel border-purple-pastel text-purple-pastel",
    Personal: "bg-pink-pastel border-pink-pastel text-pink-pastel",
    Health: "bg-green-pastel border-green-pastel text-green-pastel",
    Review: "bg-orange-pastel border-orange-pastel text-orange-pastel",
  }
  return colors[category] || "bg-muted border-border text-muted-foreground"
}

export function getTaskStatusColor(task: any): string {
  if (task.completed) return "opacity-50 line-through"
  const dueDate = task.dueDate ? new Date(task.dueDate) : new Date()
  const today = new Date()
  if (dueDate < today && !task.completed) return "ring-2 ring-orange-pastel"
  return ""
}
