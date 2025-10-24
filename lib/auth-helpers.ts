import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}
