"use client"

import { AuthGuard } from "@/components/auth-guard"
import { TodoList } from "@/components/todo-list"
import { UserStatsDashboard } from "@/components/user-stats-dashboard"

export default function TodosPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Todos & Points</h1>
              <p className="text-sm text-muted-foreground">Manage your todos and track your progress</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Todo Management */}
            <div className="lg:col-span-2">
              <TodoList />
            </div>

            {/* Right Column - Stats Dashboard */}
            <div className="lg:col-span-1">
              <UserStatsDashboard />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
