export type RecurrenceType = "once" | "daily" | "weekly" | "monthly" | "yearly"

export interface RecurrenceRule {
  type: RecurrenceType
  endDate?: string
  daysOfWeek?: number[] // 0-6 for Sunday-Saturday
  dayOfMonth?: number
}

export function getNextOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
  const next = new Date(currentDate)

  switch (rule.type) {
    case "daily":
      next.setDate(next.getDate() + 1)
      break
    case "weekly":
      next.setDate(next.getDate() + 7)
      break
    case "monthly":
      next.setMonth(next.getMonth() + 1)
      break
    case "yearly":
      next.setFullYear(next.getFullYear() + 1)
      break
    case "once":
    default:
      return new Date(0) // Return epoch for non-recurring
  }

  if (rule.endDate && next > new Date(rule.endDate)) {
    return new Date(0)
  }

  return next
}

export function shouldGenerateNextInstance(
  lastCompletedDate: string | undefined,
  recurrenceRule: RecurrenceRule,
): boolean {
  if (recurrenceRule.type === "once") return false

  const now = new Date()
  const lastCompleted = lastCompletedDate ? new Date(lastCompletedDate) : new Date(0)
  const nextOccurrence = getNextOccurrence(lastCompleted, recurrenceRule)

  return now >= nextOccurrence && nextOccurrence.getTime() !== 0
}

export function formatRecurrenceLabel(rule: RecurrenceType): string {
  const labels: Record<RecurrenceType, string> = {
    once: "Once",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  }
  return labels[rule]
}
