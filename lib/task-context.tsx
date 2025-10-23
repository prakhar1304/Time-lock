"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { RecurrenceRule, RecurrenceType } from "./recurring-utils"
import { getNextOccurrence } from "./recurring-utils"
import { calculateStreak, getToday } from "./streak-utils"

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  time: string
  recurring: RecurrenceType
  recurrenceRule?: RecurrenceRule
  completed: boolean
  userId: string
  createdAt: string
  dueDate?: string
  lastCompletedDate?: string
  parentTaskId?: string // For tracking recurring task instances
  points?: number // Points awarded for completion
  priority?: 'low' | 'medium' | 'high' // Priority level
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  points: number
  priority: 'low' | 'medium' | 'high'
  userId: string
  createdAt: string
  completedAt?: string
  category?: string
}

export interface UserStats {
  userId: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  lastActiveDate?: string
  todosCompletedToday: number
  totalTodosCompleted: number
}

interface TaskContextType {
  tasks: Task[]
  todos: Todo[]
  userStats: UserStats | null
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  getRecurringTasks: () => Task[]
  getTaskInstances: (parentTaskId: string) => Task[]
  // Todo management
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void
  updateTodo: (id: string, todo: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodoComplete: (id: string) => void
  // Stats management
  updateUserStats: (stats: Partial<UserStats>) => void
  getPointsForPriority: (priority: 'low' | 'medium' | 'high') => number
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks, todos, and user stats from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks')
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          setTasks(tasksData)
        } else {
          console.error('Failed to fetch tasks from MongoDB')
          const storedTasks = localStorage.getItem("tasks")
          if (storedTasks) {
            try {
              setTasks(JSON.parse(storedTasks))
            } catch (error) {
              console.error("Failed to parse stored tasks:", error)
            }
          }
        }

        // Fetch todos
        const todosResponse = await fetch('/api/todos')
        if (todosResponse.ok) {
          const todosData = await todosResponse.json()
          setTodos(todosData)
        } else {
          console.error('Failed to fetch todos from MongoDB')
          const storedTodos = localStorage.getItem("todos")
          if (storedTodos) {
            try {
              setTodos(JSON.parse(storedTodos))
            } catch (error) {
              console.error("Failed to parse stored todos:", error)
            }
          }
        }

        // Fetch user stats
        const statsResponse = await fetch('/api/user/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setUserStats(statsData)
        } else {
          console.error('Failed to fetch user stats from MongoDB')
          const storedStats = localStorage.getItem("userStats")
          if (storedStats) {
            try {
              setUserStats(JSON.parse(storedStats))
            } catch (error) {
              console.error("Failed to parse stored user stats:", error)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to localStorage
        const storedTasks = localStorage.getItem("tasks")
        const storedTodos = localStorage.getItem("todos")
        const storedStats = localStorage.getItem("userStats")
        
        if (storedTasks) {
          try {
            setTasks(JSON.parse(storedTasks))
          } catch (error) {
            console.error("Failed to parse stored tasks:", error)
          }
        }
        
        if (storedTodos) {
          try {
            setTodos(JSON.parse(storedTodos))
          } catch (error) {
            console.error("Failed to parse stored todos:", error)
          }
        }
        
        if (storedStats) {
          try {
            setUserStats(JSON.parse(storedStats))
          } catch (error) {
            console.error("Failed to parse stored user stats:", error)
          }
        }
      }
      setIsLoaded(true)
    }
    
    fetchData()
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks))
        localStorage.setItem("todos", JSON.stringify(todos))
        if (userStats) {
          localStorage.setItem("userStats", JSON.stringify(userStats))
        }
      } catch (error) {
        console.error('Error syncing data:', error)
      }
    }
  }, [tasks, todos, userStats, isLoaded])

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      
      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
      } else {
        // Fallback to local state if API fails
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        setTasks([...tasks, newTask])
      }
    } catch (error) {
      console.error('Error adding task:', error)
      // Fallback to local state
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setTasks([...tasks, newTask])
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })
      
      if (response.ok) {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
      } else {
        // Fallback to local state if API fails
        setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Fallback to local state
      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Delete the task and all its instances
        setTasks(tasks.filter((task) => task.id !== id && task.parentTaskId !== id))
      } else {
        // Fallback to local state if API fails
        setTasks(tasks.filter((task) => task.id !== id && task.parentTaskId !== id))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      // Fallback to local state
      setTasks(tasks.filter((task) => task.id !== id && task.parentTaskId !== id))
    }
  }

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const now = new Date().toISOString()
    const isCompleting = !task.completed

    if (isCompleting && task.recurring !== "once") {
      const nextOccurrence = getNextOccurrence(new Date(now), task.recurrenceRule || { type: task.recurring })

      if (nextOccurrence.getTime() !== 0) {
        const nextInstance: Task = {
          ...task,
          id: Date.now().toString(),
          completed: false,
          createdAt: now,
          parentTaskId: task.parentTaskId || task.id,
          lastCompletedDate: undefined,
          dueDate: nextOccurrence.toISOString().split("T")[0],
        }
        setTasks([
          ...tasks.map((t) => (t.id === id ? { ...t, completed: true, lastCompletedDate: now } : t)),
          nextInstance,
        ])
        return
      }
    }

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, lastCompletedDate: isCompleting ? now : undefined } : t,
      ),
    )
  }

  const getRecurringTasks = () => {
    return tasks.filter((task) => task.recurring !== "once" && !task.parentTaskId)
  }

  const getTaskInstances = (parentTaskId: string) => {
    return tasks.filter((task) => task.parentTaskId === parentTaskId || task.id === parentTaskId)
  }

  // Points system
  const getPointsForPriority = (priority: 'low' | 'medium' | 'high'): number => {
    switch (priority) {
      case 'low': return 1
      case 'medium': return 3
      case 'high': return 5
      default: return 1
    }
  }

  // Todo management functions
  const addTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
      
      if (response.ok) {
        const newTodo = await response.json()
        setTodos([...todos, newTodo])
      } else {
        // Fallback to local state if API fails
        const newTodo: Todo = {
          ...todo,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        setTodos([...todos, newTodo])
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      // Fallback to local state
      const newTodo: Todo = {
        ...todo,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setTodos([...todos, newTodo])
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })
      
      if (response.ok) {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
      } else {
        // Fallback to local state if API fails
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      // Fallback to local state
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
      } else {
        // Fallback to local state if API fails
        setTodos(todos.filter((todo) => todo.id !== id))
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      // Fallback to local state
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  const toggleTodoComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const now = new Date().toISOString()
    const isCompleting = !todo.completed

    // Update todo completion status
    await updateTodo(id, {
      completed: isCompleting,
      completedAt: isCompleting ? now : undefined
    })

    // Update user stats if completing
    if (isCompleting) {
      const todosCompletedToday = todos.filter(t => 
        t.completed && t.completedAt && t.completedAt.split('T')[0] === getToday()
      ).length + 1 // +1 for the todo we just completed

      const { currentStreak, longestStreak } = calculateStreak(userStats, todosCompletedToday)

      await updateUserStats({
        totalPoints: (userStats?.totalPoints || 0) + todo.points,
        totalTodosCompleted: (userStats?.totalTodosCompleted || 0) + 1,
        todosCompletedToday: todosCompletedToday,
        currentStreak,
        longestStreak,
        lastActiveDate: now
      })
    }
  }

  // User stats management
  const updateUserStats = async (stats: Partial<UserStats>) => {
    try {
      const response = await fetch('/api/user/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      })
      
      if (response.ok) {
        setUserStats(prev => prev ? { ...prev, ...stats } : null)
      } else {
        // Fallback to local state if API fails
        setUserStats(prev => prev ? { ...prev, ...stats } : null)
      }
    } catch (error) {
      console.error('Error updating user stats:', error)
      // Fallback to local state
      setUserStats(prev => prev ? { ...prev, ...stats } : null)
    }
  }

  return (
    <TaskContext.Provider
      value={{ 
        tasks, 
        todos, 
        userStats,
        addTask, 
        updateTask, 
        deleteTask, 
        toggleTaskComplete, 
        getRecurringTasks, 
        getTaskInstances,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoComplete,
        updateUserStats,
        getPointsForPriority
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
