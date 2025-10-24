import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { UserProfile } from '@/lib/ai-types'
import { getUserFromRequest } from '@/lib/auth-helpers'

export const runtime = 'nodejs'

// Simple encryption/decryption for API keys (in production, use proper encryption)
function encryptApiKey(apiKey: string): string {
  return Buffer.from(apiKey).toString('base64')
}

function decryptApiKey(encryptedKey: string): string {
  return Buffer.from(encryptedKey, 'base64').toString('utf-8')
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const db = await getDatabase()
    const profile = await db.collection('user_profiles').findOne({ userId: user.id })
    
    if (!profile) {
      // Create default profile if none exists
      const defaultProfile: UserProfile = {
        userId: user.id,
        preferredModel: 'gemini-flash-2.0',
        aiSettings: {
          temperature: 0.7,
          maxTokens: 1000,
          systemPersonality: 'helpful'
        },
        userGoals: [],
        preferences: {
          taskCategories: ['Work', 'Study', 'Personal', 'Health', 'Review'],
          workingHours: { start: '09:00', end: '17:00' },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notificationSettings: {
            taskReminders: true,
            goalProgress: true,
            aiInsights: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('user_profiles').insertOne(defaultProfile)
      return NextResponse.json({ 
        ...defaultProfile, 
        _id: result.insertedId.toString(),
        geminiApiKey: undefined // Never return the API key
      })
    }

    // Decrypt API key for validation (but don't return it)
    const profileResponse = {
      ...profile,
      _id: profile._id?.toString(),
      geminiApiKey: profile.geminiApiKey ? '[CONFIGURED]' : undefined
    }

    return NextResponse.json(profileResponse)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const updates = await request.json()
    console.log('Profile update request for user:', user.id, 'Updates:', Object.keys(updates))
    
    const { geminiApiKey, _id, ...otherUpdates } = updates

    const db = await getDatabase()
    
    // Prepare update data
    const updateData: any = {
      ...otherUpdates,
      updatedAt: new Date()
    }

    // Encrypt API key if provided
    if (geminiApiKey && geminiApiKey !== '[CONFIGURED]') {
      console.log('Encrypting API key, length:', geminiApiKey.length)
      updateData.geminiApiKey = encryptApiKey(geminiApiKey)
    }

    console.log('Update data keys:', Object.keys(updateData))

    const result = await db.collection('user_profiles').updateOne(
      { userId: user.id },
      { $set: updateData },
      { upsert: true }
    )

    console.log('Update result:', { matchedCount: result.matchedCount, upsertedCount: result.upsertedCount })

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const profileData = await request.json()
    const { geminiApiKey, ...otherData } = profileData

    const db = await getDatabase()
    
    const newProfile: UserProfile = {
      userId: user.id,
      preferredModel: 'gemini-flash-2.0',
      aiSettings: {
        temperature: 0.7,
        maxTokens: 1000,
        systemPersonality: 'helpful'
      },
      userGoals: [],
      preferences: {
        taskCategories: ['Work', 'Study', 'Personal', 'Health', 'Review'],
        workingHours: { start: '09:00', end: '17:00' },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notificationSettings: {
          taskReminders: true,
          goalProgress: true,
          aiInsights: true
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...otherData
    }

    // Encrypt API key if provided
    if (geminiApiKey) {
      newProfile.geminiApiKey = encryptApiKey(geminiApiKey)
    }

    const result = await db.collection('user_profiles').insertOne(newProfile)
    
    return NextResponse.json({ 
      success: true, 
      profileId: result.insertedId.toString() 
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}