import { ObjectId } from 'mongodb'

export interface UserProfile {
  _id?: ObjectId
  userId: string
  geminiApiKey?: string // Encrypted
  preferredModel: 'gemini-flash-2.0' | 'gpt-4o-mini' | 'gemini-pro'
  aiSettings: {
    temperature: number // 0.1-1.0
    maxTokens: number
    systemPersonality: 'helpful' | 'motivational' | 'analytical' | 'casual'
  }
  userGoals: string[] // Long-term objectives
  preferences: {
    taskCategories: string[]
    workingHours: { start: string; end: string }
    timezone: string
    notificationSettings: {
      taskReminders: boolean
      goalProgress: boolean
      aiInsights: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface AIMemory {
  _id?: ObjectId
  userId: string
  sessionId: string
  conversationHistory: ConversationMessage[]
  userInsights: {
    productivityPatterns: {
      mostProductiveHours: string[]
      preferredTaskTypes: string[]
      averageTaskCompletionTime: number
      weeklyGoalProgress: number
    }
    commonChallenges: string[]
    successMetrics: {
      tasksCompletedThisWeek: number
      goalsAchievedThisMonth: number
      averageProductivityScore: number
    }
  }
  contextSummary: string // AI-generated summary of user's current situation
  createdAt: Date
  updatedAt: Date
}

export interface ConversationMessage {
  messageId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  context?: {
    tasksMentioned: string[]
    goalsReferenced: string[]
    insightsGenerated: string[]
  }
}

export interface AIConversation {
  _id?: ObjectId
  userId: string
  sessionId: string
  messages: ConversationMessage[]
  summary: string
  insights: string[]
  createdAt: Date
  updatedAt: Date
}
