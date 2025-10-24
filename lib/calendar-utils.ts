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
    // Check if task has valid dueDate or use today as default
    const taskDate = task.dueDate && typeof task.dueDate === 'string' 
      ? task.dueDate.split("T")[0] 
      : new Date().toISOString().split("T")[0]
    return taskDate === dateStr && !task.parentTaskId
  })
}

export function getTasksForDateAndTime(tasks: any[], date: Date, hour: number): any[] {
  const tasksForDate = getTasksForDate(tasks, date)
  return tasksForDate.filter((task) => {
    // Check if task.time exists and is a valid string
    if (!task.time || typeof task.time !== 'string') {
      return false // Skip tasks without valid time
    }
    
    const timeParts = task.time.split(":")
    if (timeParts.length < 2) {
      return false // Skip tasks with invalid time format
    }
    
    const taskHour = Number.parseInt(timeParts[0])
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
    Work: "bg-blue-100 border-blue-300 text-blue-800",
    Study: "bg-purple-100 border-purple-300 text-purple-800", 
    Personal: "bg-pink-100 border-pink-300 text-pink-800",
    Health: "bg-green-100 border-green-300 text-green-800",
    Review: "bg-orange-100 border-orange-300 text-orange-800",
    Exercise: "bg-emerald-100 border-emerald-300 text-emerald-800",
    Meeting: "bg-indigo-100 border-indigo-300 text-indigo-800",
    Project: "bg-cyan-100 border-cyan-300 text-cyan-800",
    Learning: "bg-violet-100 border-violet-300 text-violet-800",
    Break: "bg-yellow-100 border-yellow-300 text-yellow-800",
    Shopping: "bg-rose-100 border-rose-300 text-rose-800",
    Travel: "bg-teal-100 border-teal-300 text-teal-800",
  }
  return colors[category] || "bg-gray-100 border-gray-300 text-gray-800"
}

export function getTaskStatusColor(task: any): string {
  if (task.completed) return "opacity-50 line-through"
  
  // Check if dueDate exists and is valid
  if (!task.dueDate || typeof task.dueDate !== 'string') {
    return "" // No due date, no special styling
  }
  
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  
  // Check if the date is valid
  if (isNaN(dueDate.getTime())) {
    return "" // Invalid date, no special styling
  }
  
  if (dueDate < today && !task.completed) return "ring-2 ring-orange-pastel"
  return ""
}
