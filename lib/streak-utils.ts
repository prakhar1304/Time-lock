import { UserStats } from '@/lib/task-context'

export function calculateStreak(userStats: UserStats | null, todosCompletedToday: number): { currentStreak: number; longestStreak: number } {
  if (!userStats) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const today = new Date().toISOString().split('T')[0]
  const lastActiveDate = userStats.lastActiveDate ? userStats.lastActiveDate.split('T')[0] : null
  
  let currentStreak = userStats.currentStreak || 0
  let longestStreak = userStats.longestStreak || 0

  // If user completed at least one todo today
  if (todosCompletedToday > 0) {
    // If last active date was yesterday, increment streak
    if (lastActiveDate === getYesterday()) {
      currentStreak += 1
    } else if (lastActiveDate !== today) {
      // If last active date was not yesterday or today, reset streak
      currentStreak = 1
    }
    // If last active date was today, keep current streak
    
    // Update longest streak if current streak is higher
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak
    }
  } else {
    // If no todos completed today and last active date was not today, reset streak
    if (lastActiveDate !== today) {
      currentStreak = 0
    }
  }

  return { currentStreak, longestStreak }
}

export function getYesterday(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function shouldResetStreak(lastActiveDate: string | undefined): boolean {
  if (!lastActiveDate) return true
  
  const today = getToday()
  const yesterday = getYesterday()
  
  // Reset streak if last active date was before yesterday
  return lastActiveDate < yesterday
}



