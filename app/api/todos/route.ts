import { NextRequest, NextResponse } from 'next/server'
import { UserDataManager } from '@/lib/user-data-manager'
import { getUserFromRequest } from '@/lib/auth-helpers'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const userDataManager = new UserDataManager(user.id)
    const todos = await userDataManager.getTodos()
    
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const todoData = await request.json()
    const userDataManager = new UserDataManager(user.id)
    
    const success = await userDataManager.addTodo(todoData)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { id, ...updates } = await request.json()
    const userDataManager = new UserDataManager(user.id)
    
    const success = await userDataManager.updateTodo(id, updates)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 })
    }

    const userDataManager = new UserDataManager(user.id)
    const success = await userDataManager.deleteTodo(id)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
