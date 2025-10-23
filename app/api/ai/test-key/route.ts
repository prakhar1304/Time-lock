import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    // Test the API key with a simple request
    const { text } = await generateText({
      model: 'google/gemini-flash-2.0',
      apiKey,
      prompt: 'Say "API key is working" if you can read this.',
      maxTokens: 50,
    })

    if (text && text.toLowerCase().includes('api key is working')) {
      return NextResponse.json({ 
        success: true, 
        message: 'API key is valid and working!' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'API key test failed' 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('API key test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'API key is invalid or there was an error' 
    }, { status: 400 })
  }
}
