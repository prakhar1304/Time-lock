import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { AIMemory, ConversationMessage, AIConversation } from '@/lib/ai-types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    
    let query: any = { userId }
    if (sessionId) {
      query.sessionId = sessionId
    }

    const memory = await db.collection('ai_memory').findOne(query)
    
    if (!memory) {
      // Create default memory if none exists
      const defaultMemory: AIMemory = {
        userId,
        sessionId: sessionId || `session_${Date.now()}`,
        conversationHistory: [],
        userInsights: {
          productivityPatterns: {
            mostProductiveHours: [],
            preferredTaskTypes: [],
            averageTaskCompletionTime: 0,
            weeklyGoalProgress: 0
          },
          commonChallenges: [],
          successMetrics: {
            tasksCompletedThisWeek: 0,
            goalsAchievedThisMonth: 0,
            averageProductivityScore: 0
          }
        },
        contextSummary: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('ai_memory').insertOne(defaultMemory)
      return NextResponse.json({ 
        ...defaultMemory, 
        _id: result.insertedId.toString()
      })
    }

    return NextResponse.json({
      ...memory,
      _id: memory._id?.toString()
    })
  } catch (error) {
    console.error('Error fetching AI memory:', error)
    return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId, message, role, context } = await request.json()

    if (!userId || !message || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    
    const newMessage: ConversationMessage = {
      messageId: `msg_${Date.now()}`,
      role,
      content: message,
      timestamp: new Date(),
      context
    }

    // Update or create memory
    const result = await db.collection('ai_memory').updateOne(
      { userId, sessionId: sessionId || `session_${Date.now()}` },
      { 
        $push: { conversationHistory: newMessage },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      messageId: newMessage.messageId 
    })
  } catch (error) {
    console.error('Error saving AI memory:', error)
    return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, sessionId, insights, contextSummary } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    
    const updateData: any = {
      updatedAt: new Date()
    }

    if (insights) {
      updateData['userInsights.productivityPatterns'] = insights.productivityPatterns
      updateData['userInsights.commonChallenges'] = insights.commonChallenges
      updateData['userInsights.successMetrics'] = insights.successMetrics
    }

    if (contextSummary) {
      updateData.contextSummary = contextSummary
    }

    const result = await db.collection('ai_memory').updateOne(
      { userId, sessionId: sessionId || `session_${Date.now()}` },
      { $set: updateData },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating AI memory:', error)
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 })
  }
}
