import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const stats = await db.collection('userStats').findOne({})
    
    if (!stats) {
      // Create default stats if none exist
      const defaultStats = {
        userId: 'default-user',
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        todosCompletedToday: 0,
        totalTodosCompleted: 0
      }
      
      const result = await db.collection('userStats').insertOne(defaultStats)
      return NextResponse.json({
        id: result.insertedId.toString(),
        ...defaultStats
      })
    }
    
    return NextResponse.json({
      id: stats._id.toString(),
      ...stats,
      _id: undefined
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    const db = await getDatabase()
    
    // Update or create user stats
    const result = await db.collection('userStats').updateOne(
      {},
      { 
        $set: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json({ error: 'Failed to update user stats' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const stats = await request.json()
    const db = await getDatabase()
    
    const result = await db.collection('userStats').insertOne({
      ...stats,
      createdAt: new Date().toISOString(),
    })
    
    return NextResponse.json({ 
      id: result.insertedId.toString(), 
      ...stats,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating user stats:', error)
    return NextResponse.json({ error: 'Failed to create user stats' }, { status: 500 })
  }
}
