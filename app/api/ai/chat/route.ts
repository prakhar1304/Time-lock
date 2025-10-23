import { generateText } from "ai"
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { buildSystemPrompt, extractTaskSuggestions, generateContextSummary } from '@/lib/ai-context'
import type { UserProfile, AIMemory } from '@/lib/ai-types'

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

    // Determine which model to use
    let model = 'openai/gpt-4o-mini' // Default fallback
    let apiKey = process.env.OPENAI_API_KEY

    if (userProfile.preferredModel === 'gemini-flash-2.0' && userProfile.geminiApiKey) {
      try {
        const decryptedKey = decryptApiKey(userProfile.geminiApiKey)
        model = 'google/gemini-flash-2.0'
        apiKey = decryptedKey
      } catch (error) {
        console.warn('Failed to decrypt Gemini API key, falling back to OpenAI')
      }
    }

    const { text } = await generateText({
      model,
      apiKey,
      system: systemPrompt,
      prompt: message,
      temperature: userProfile.aiSettings?.temperature || 0.7,
      maxTokens: userProfile.aiSettings?.maxTokens || 1000,
    })

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
        modelUsed: model
      }
    })
  } catch (error) {
    console.error("AI chat error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
