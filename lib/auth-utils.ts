import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/mongodb'
import type { User, UserSession, AuthResponse } from '@/lib/user-types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: UserSession): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    }
  } catch (error) {
    return null
  }
}

export async function createUser(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const db = await getDatabase()
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('users').insertOne(newUser)
    
    if (result.insertedId) {
      const userSession: UserSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
      
      const token = generateToken(userSession)
      
      // Create user-specific data collection
      await createUserDataCollection(newUser.id)
      
      return { 
        success: true, 
        user: userSession, 
        token 
      }
    }
    
    return { success: false, error: 'Failed to create user' }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const db = await getDatabase()
    
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' }
    }

    const userSession: UserSession = {
      id: user.id,
      email: user.email,
      name: user.name
    }
    
    const token = generateToken(userSession)
    
    return { 
      success: true, 
      user: userSession, 
      token 
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    return await db.collection('users').findOne({ id: userId })
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function createUserDataCollection(userId: string): Promise<void> {
  try {
    const db = await getDatabase()
    
    // Create user-specific data document
    const userData = {
      userId,
      tasks: [],
      todos: [],
      analytics: [],
      calendar: [],
      streaks: [],
      goals: [],
      preferences: {
        theme: 'light',
        notifications: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('user_data').insertOne(userData)
  } catch (error) {
    console.error('Error creating user data collection:', error)
  }
}

export async function getUserData(userId: string): Promise<any> {
  try {
    const db = await getDatabase()
    return await db.collection('user_data').findOne({ userId })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export async function updateUserData(userId: string, data: any): Promise<boolean> {
  try {
    const db = await getDatabase()
    const result = await db.collection('user_data').updateOne(
      { userId },
      { 
        $set: { 
          ...data, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )
    return result.modifiedCount > 0 || result.upsertedCount > 0
  } catch (error) {
    console.error('Error updating user data:', error)
    return false
  }
}

