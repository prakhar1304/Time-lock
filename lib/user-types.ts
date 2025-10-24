export interface User {
  _id?: string
  id: string
  email: string
  password: string // This will be hashed in production
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  email: string
  name: string
}

export interface UserData {
  userId: string
  tasks: any[]
  todos: any[]
  analytics: any[]
  calendar: any[]
  streaks: any[]
  goals: any[]
  preferences: any
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  success: boolean
  user?: UserSession
  token?: string
  error?: string
}

