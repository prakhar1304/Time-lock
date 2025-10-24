import { GoogleGenAI } from '@google/genai'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { buildSystemPrompt, extractTaskSuggestions, generateContextSummary } from '@/lib/ai-context'
import type { UserProfile, AIMemory } from '@/lib/ai-types'

export const runtime = 'nodejs'

// Simple encryption/decryption for API keys
function decryptApiKey(encryptedKey: string): string {
  return Buffer.from(encryptedKey, 'base64').toString('utf-8')
}

export async function POST(request: Request) {
  try {
    const { message, tasks, userId, sessionId } = await request.json()

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Get user profile
    const userProfile = await db.collection('user_profiles').findOne({ userId }) as UserProfile
    if (!userProfile) {
      return Response.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get AI memory
    const aiMemory = await db.collection('ai_memory').findOne({ 
      userId, 
      sessionId: sessionId || `session_${Date.now()}` 
    }) as AIMemory

    // Build context
    const context = {
      userProfile,
      aiMemory: aiMemory || {
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
      },
      currentTasks: tasks || [],
      recentMessages: aiMemory?.conversationHistory?.slice(-10) || []
    }

    // Build enhanced system prompt
    const systemPrompt = buildSystemPrompt(context)

    // Determine which Gemini model to use
    let modelName = ''
    let apiKey = ''

    if (userProfile.geminiApiKey) {
      try {
        const decryptedKey = decryptApiKey(userProfile.geminiApiKey)
        
        // Map user's preferred model to the correct Google model identifier
        switch (userProfile.preferredModel) {
          case 'gemini-pro':
            modelName = 'gemini-1.5-pro'
            break
          case 'gemini-pro-vision':
            modelName = 'gemini-1.5-pro'
            break
          case 'gemini-flash-2.0':
          default:
            modelName = 'gemini-2.5-flash'
            break
        }
        
        apiKey = decryptedKey
      } catch (error) {
        console.error('Failed to decrypt API key:', error)
        return Response.json({ error: 'Invalid API key configuration' }, { status: 400 })
      }
    } else {
      return Response.json({ error: 'Gemini API key not configured' }, { status: 400 })
    }

    // Use the official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey })
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${systemPrompt}\n\nUser: ${message}`,
    })

    const text = response.text

    // Save conversation to memory
    const conversationMessage = {
      messageId: `msg_${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
      context: {
        tasksMentioned: tasks?.map((t: any) => t.title) || [],
        goalsReferenced: [],
        insightsGenerated: []
      }
    }

    const assistantMessage = {
      messageId: `msg_${Date.now() + 1}`,
      role: 'assistant' as const,
      content: text,
      timestamp: new Date(),
      context: {
        tasksMentioned: [],
        goalsReferenced: [],
        insightsGenerated: extractTaskSuggestions(text).map(t => t.title)
      }
    }

    // Update AI memory
    await db.collection('ai_memory').updateOne(
      { userId, sessionId: sessionId || `session_${Date.now()}` },
      { 
        $push: { 
          conversationHistory: { $each: [conversationMessage, assistantMessage] }
        },
        $set: { 
          updatedAt: new Date(),
          contextSummary: generateContextSummary(tasks, userProfile, [conversationMessage])
        }
      },
      { upsert: true }
    )

    // Extract task suggestions
    const taskSuggestions = extractTaskSuggestions(text)

    return Response.json({ 
      response: text,
      taskSuggestions,
      contextUsed: {
        userGoals: userProfile.userGoals,
        workingHours: userProfile.preferences.workingHours,
        modelUsed: modelName
      }
    })
  } catch (error) {
    console.error("AI chat error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
