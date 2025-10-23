import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const todos = await db.collection('todos').find({}).toArray()
    // Convert ObjectId to string for JSON serialization
    const todosWithStringIds = todos.map(todo => ({
      ...todo,
      id: todo._id.toString(),
      _id: undefined
    }))
    return NextResponse.json(todosWithStringIds)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const todo = await request.json()
    const db = await getDatabase()
    
    const result = await db.collection('todos').insertOne({
      ...todo,
      createdAt: new Date().toISOString(),
    })
    
    return NextResponse.json({ 
      id: result.insertedId.toString(), 
      ...todo,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const db = await getDatabase()
    
    const result = await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 })
    }
    
    const db = await getDatabase()
    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
