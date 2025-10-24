import { getDatabase } from '@/lib/mongodb'
import type { UserData } from '@/lib/user-types'

export class UserDataManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async getTasks() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.tasks || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  async addTask(task: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $push: { tasks: { ...task, id: Date.now().toString(), createdAt: new Date() } },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error adding task:', error)
      return false
    }
  }

  async updateTask(taskId: string, updates: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { 
          userId: this.userId,
          'tasks.id': taskId
        },
        { 
          $set: { 
            'tasks.$.updatedAt': new Date(),
            ...Object.keys(updates).reduce((acc, key) => {
              acc[`tasks.$.${key}`] = updates[key]
              return acc
            }, {} as any)
          },
          $set: { updatedAt: new Date() }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating task:', error)
      return false
    }
  }

  async deleteTask(taskId: string) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $pull: { tasks: { id: taskId } },
          $set: { updatedAt: new Date() }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  async getTodos() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.todos || []
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  }

  async addTodo(todo: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $push: { todos: { ...todo, id: Date.now().toString(), createdAt: new Date() } },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error adding todo:', error)
      return false
    }
  }

  async updateTodo(todoId: string, updates: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { 
          userId: this.userId,
          'todos.id': todoId
        },
        { 
          $set: { 
            'todos.$.updatedAt': new Date(),
            ...Object.keys(updates).reduce((acc, key) => {
              acc[`todos.$.${key}`] = updates[key]
              return acc
            }, {} as any)
          },
          $set: { updatedAt: new Date() }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating todo:', error)
      return false
    }
  }

  async deleteTodo(todoId: string) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $pull: { todos: { id: todoId } },
          $set: { updatedAt: new Date() }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error deleting todo:', error)
      return false
    }
  }

  async getAnalytics() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.analytics || []
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return []
    }
  }

  async addAnalytics(analyticsData: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $push: { analytics: { ...analyticsData, id: Date.now().toString(), createdAt: new Date() } },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error adding analytics:', error)
      return false
    }
  }

  async getStreaks() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.streaks || []
    } catch (error) {
      console.error('Error fetching streaks:', error)
      return []
    }
  }

  async updateStreaks(streaks: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $set: { 
            streaks,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error updating streaks:', error)
      return false
    }
  }

  async getGoals() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.goals || []
    } catch (error) {
      console.error('Error fetching goals:', error)
      return []
    }
  }

  async addGoal(goal: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $push: { goals: { ...goal, id: Date.now().toString(), createdAt: new Date() } },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error adding goal:', error)
      return false
    }
  }

  async updateGoal(goalId: string, updates: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { 
          userId: this.userId,
          'goals.id': goalId
        },
        { 
          $set: { 
            'goals.$.updatedAt': new Date(),
            ...Object.keys(updates).reduce((acc, key) => {
              acc[`goals.$.${key}`] = updates[key]
              return acc
            }, {} as any)
          },
          $set: { updatedAt: new Date() }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating goal:', error)
      return false
    }
  }

  async getPreferences() {
    try {
      const db = await getDatabase()
      const userData = await db.collection('user_data').findOne({ userId: this.userId })
      return userData?.preferences || {
        theme: 'light',
        notifications: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      return {
        theme: 'light',
        notifications: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
  }

  async updatePreferences(preferences: any) {
    try {
      const db = await getDatabase()
      const result = await db.collection('user_data').updateOne(
        { userId: this.userId },
        { 
          $set: { 
            preferences: { ...preferences },
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error updating preferences:', error)
      return false
    }
  }

  async getAllUserData() {
    try {
      const db = await getDatabase()
      return await db.collection('user_data').findOne({ userId: this.userId })
    } catch (error) {
      console.error('Error fetching all user data:', error)
      return null
    }
  }
}

