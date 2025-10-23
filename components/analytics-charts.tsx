"use client"

import { useTask } from "@/lib/task-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateCategoryStats, calculateDailyStats, getProductivityTrend } from "@/lib/analytics-utils"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function AnalyticsCharts() {
  const { tasks } = useTask()

  const categoryStats = calculateCategoryStats(tasks)
  const dailyStats = calculateDailyStats(tasks, 7)
  const trend = getProductivityTrend(tasks)

  const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#3b82f6", "#10b981"]

  const trendIcon = {
    improving: <TrendingUp className="h-5 w-5 text-green-500" />,
    declining: <TrendingDown className="h-5 w-5 text-red-500" />,
    stable: <Minus className="h-5 w-5 text-yellow-500" />,
  }

  const trendLabel = {
    improving: "Improving",
    declining: "Declining",
    stable: "Stable",
  }

  return (
    <div className="space-y-6">
      {/* Productivity Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productivity Trend</CardTitle>
              <CardDescription>Your performance over the last 2 weeks</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {trendIcon[trend]}
              <span className="text-sm font-medium">{trendLabel[trend]}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Daily Completion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Tasks completed over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: "12px" }}
                tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
              />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)" }}
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                dot={{ fill: "var(--color-muted-foreground)" }}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Distribution of tasks across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Category Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Completion by Category</CardTitle>
            <CardDescription>Completion rate for each category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="category" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Bar dataKey="percentage" fill="var(--color-primary)" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
