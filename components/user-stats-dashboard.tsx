"use client"

import { useTask } from "@/lib/task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Target, Zap, Star, Calendar } from "lucide-react"

export function UserStatsDashboard() {
  const { userStats, todos } = useTask()

  if (!userStats) {
    return (
      <Card className="glass-card gradient-purple border-purple-pastel">
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <h3 className="text-lg font-medium">Loading stats...</h3>
          </div>
        </CardContent>
      </Card>
    )
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const highPriorityCompleted = completedTodos.filter(todo => todo.priority === 'high').length
  const mediumPriorityCompleted = completedTodos.filter(todo => todo.priority === 'medium').length
  const lowPriorityCompleted = completedTodos.filter(todo => todo.priority === 'low').length

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥"
    if (streak >= 14) return "🔥🔥"
    if (streak >= 7) return "🔥"
    if (streak >= 3) return "⚡"
    return "💪"
  }

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!"
    if (streak === 1) return "Great start! Keep it going!"
    if (streak < 7) return "Building momentum!"
    if (streak < 14) return "One week strong!"
    if (streak < 30) return "Two weeks strong!"
    return "Incredible dedication!"
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Points */}
        <Card className="glass-card gradient-purple border-purple-pastel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{userStats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Earned from {userStats.totalTodosCompleted} completed todos
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="glass-card gradient-orange border-orange-pastel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              {userStats.currentStreak}
              <span className="text-lg">{getStreakEmoji(userStats.currentStreak)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {getStreakMessage(userStats.currentStreak)}
            </p>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="glass-card gradient-pink border-pink-pastel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{userStats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">
              Your personal best record
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card className="glass-card gradient-green border-green-pastel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">{userStats.todosCompletedToday}</div>
              <p className="text-xs text-muted-foreground">Todos completed today</p>
            </div>
            <div className="flex gap-2">
              {highPriorityCompleted > 0 && (
                <Badge className="bg-red-pastel text-red-900">
                  <Star className="h-3 w-3 mr-1" />
                  {highPriorityCompleted} High
                </Badge>
              )}
              {mediumPriorityCompleted > 0 && (
                <Badge className="bg-orange-pastel text-orange-900">
                  <Zap className="h-3 w-3 mr-1" />
                  {mediumPriorityCompleted} Medium
                </Badge>
              )}
              {lowPriorityCompleted > 0 && (
                <Badge className="bg-blue-pastel text-blue-900">
                  <Target className="h-3 w-3 mr-1" />
                  {lowPriorityCompleted} Low
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="glass-card gradient-cyan border-cyan-pastel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userStats.totalPoints >= 100 && (
              <Badge className="bg-yellow-pastel text-yellow-900">
                🏆 Centurion (100+ points)
              </Badge>
            )}
            {userStats.currentStreak >= 7 && (
              <Badge className="bg-orange-pastel text-orange-900">
                🔥 Week Warrior (7+ day streak)
              </Badge>
            )}
            {userStats.currentStreak >= 30 && (
              <Badge className="bg-red-pastel text-red-900">
                🚀 Month Master (30+ day streak)
              </Badge>
            )}
            {userStats.totalTodosCompleted >= 50 && (
              <Badge className="bg-purple-pastel text-purple-900">
                ⭐ Todo Titan (50+ completed)
              </Badge>
            )}
            {userStats.totalTodosCompleted >= 10 && userStats.totalTodosCompleted < 50 && (
              <Badge className="bg-blue-pastel text-blue-900">
                🎯 Todo Tracker (10+ completed)
              </Badge>
            )}
            {userStats.totalTodosCompleted < 10 && (
              <Badge variant="outline">
                🌱 Getting Started
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Last Active */}
      {userStats.lastActiveDate && (
        <Card className="glass-card gradient-blue border-blue-pastel">
          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground">
              Last active: {new Date(userStats.lastActiveDate).toLocaleDateString()} at{' '}
              {new Date(userStats.lastActiveDate).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



