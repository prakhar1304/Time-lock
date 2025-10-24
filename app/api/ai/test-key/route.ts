import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'API key is required' 
      }, { status: 400 })
    }

    // Check if API key looks like an error message
    if (apiKey.includes('error') || apiKey.includes('Failed')) {
      return NextResponse.json({ 
        success: false, 
        message: 'API key appears to be corrupted. Please re-enter your API key.' 
      }, { status: 400 })
    }

    // Basic validation - Gemini API keys typically start with 'AIza'
    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid API key format. Gemini API keys should start with "AIza".' 
      }, { status: 400 })
    }

    console.log('Testing API key, length:', apiKey.length)
    console.log('API key starts with:', apiKey.substring(0, 10))

    try {
      // Test the API key with the official Google GenAI SDK
      const ai = new GoogleGenAI({ apiKey })
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Say 'API key is working' if you can read this.",
      })

      console.log('API response:', response.text)

      if (response.text && response.text.toLowerCase().includes('api key is working')) {
        return NextResponse.json({ 
          success: true, 
          message: 'API key is valid and working!' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: `API key test failed - unexpected response: ${response.text}` 
        }, { status: 400 })
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError)
      
      // Check for specific Gemini API errors
      if (apiError instanceof Error) {
        if (apiError.message.includes('API key')) {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid API key format or permissions' 
          }, { status: 400 })
        }
        if (apiError.message.includes('quota')) {
          return NextResponse.json({ 
            success: false, 
            message: 'API quota exceeded. Please check your Google AI Studio account.' 
          }, { status: 400 })
        }
        if (apiError.message.includes('permission')) {
          return NextResponse.json({ 
            success: false, 
            message: 'API key does not have permission to access Gemini API' 
          }, { status: 400 })
        }
        if (apiError.message.includes('billing')) {
          return NextResponse.json({ 
            success: false, 
            message: 'Billing account required. Please check your Google Cloud billing.' 
          }, { status: 400 })
        }
        
        return NextResponse.json({ 
          success: false, 
          message: `API error: ${apiError.message}` 
        }, { status: 400 })
      }
      
      throw apiError
    }
  } catch (error) {
    console.error('API key test error:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'API key is invalid or there was an error' 
    }, { status: 400 })
  }
}