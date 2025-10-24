import { NextRequest, NextResponse } from 'next/server'
import { createUser, authenticateUser } from '@/lib/auth-utils'
import type { AuthResponse } from '@/lib/user-types'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if this is a signup request (has name) or login request
    if (name) {
      // Signup
      if (!name.trim()) {
        return NextResponse.json(
          { success: false, error: 'Name is required for signup' },
          { status: 400 }
        )
      }

      const result: AuthResponse = await createUser(email, password, name)
      
      if (result.success) {
        const response = NextResponse.json(result)
        
        // Set HTTP-only cookie for token
        response.cookies.set('auth-token', result.token!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        return response
      } else {
        return NextResponse.json(result, { status: 400 })
      }
    } else {
      // Login
      const result: AuthResponse = await authenticateUser(email, password)
      
      if (result.success) {
        const response = NextResponse.json(result)
        
        // Set HTTP-only cookie for token
        response.cookies.set('auth-token', result.token!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        return response
      } else {
        return NextResponse.json(result, { status: 401 })
      }
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
