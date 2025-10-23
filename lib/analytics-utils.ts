import type { Task } from "./task-context"

export interface TaskStats {
  totalTasks: number
  completedTasks: number
  activeTasks: number
  completionRate: number
  recurringTasks: number
}

export interface CategoryStats {
  category: string
  total: number
  completed: number
  percentage: number
}

export interface DailyStats {
  date: string
  completed: number
  total: number
}

export function calculateTaskStats(tasks: Task[]): TaskStats {
  const nonInstanceTasks = tasks.filter((t) => !t.parentTaskId)
  const completedTasks = nonInstanceTasks.filter((t) => t.completed).length
  const totalTasks = nonInstanceTasks.length

  return {
    totalTasks,
    completedTasks,
    activeTasks: totalTasks - completedTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    recurringTasks: nonInstanceTasks.filter((t) => t.recurring !== "once").length,
  }
}

export function calculateCategoryStats(tasks: Task[]): CategoryStats[] {
  const nonInstanceTasks = tasks.filter((t) => !t.parentTaskId)
  const categoryMap = new Map<string, { total: number; completed: number }>()

  nonInstanceTasks.forEach((task) => {
    const current = categoryMap.get(task.category) || { total: 0, completed: 0 }
    categoryMap.set(task.category, {
      total: current.total + 1,
      completed: current.completed + (task.completed ? 1 : 0),
    })
  })

  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    total: stats.total,
    completed: stats.completed,
    percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }))
}

export function calculateDailyStats(tasks: Task[], days = 7): DailyStats[] {
  const stats: Map<string, { completed: number; total: number }> = new Map()

  // Initialize last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    stats.set(dateStr, { completed: 0, total: 0 })
  }

  // Count tasks by creation date
  tasks.forEach((task) => {
    const createdDate = task.createdAt.split("T")[0]
    if (stats.has(createdDate)) {
      const current = stats.get(createdDate)!
      current.total += 1
      if (task.completed) current.completed += 1
    }
  })

  return Array.from(stats.entries())
    .map(([date, data]) => ({
      date,
      completed: data.completed,
      total: data.total,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getProductivityTrend(tasks: Task[]): "improving" | "stable" | "declining" {
  const dailyStats = calculateDailyStats(tasks, 14)
  if (dailyStats.length < 2) return "stable"

  const firstWeek = dailyStats.slice(0, 7)
  const secondWeek = dailyStats.slice(7, 14)

  const firstWeekRate =
    firstWeek.reduce((sum, d) => sum + (d.total > 0 ? d.completed / d.total : 0), 0) / firstWeek.length
  const secondWeekRate =
    secondWeek.reduce((sum, d) => sum + (d.total > 0 ? d.completed / d.total : 0), 0) / secondWeek.length

  if (secondWeekRate > firstWeekRate * 1.1) return "improving"
  if (secondWeekRate < firstWeekRate * 0.9) return "declining"
  return "stable"
}
