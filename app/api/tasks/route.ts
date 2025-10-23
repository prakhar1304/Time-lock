import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const tasks = await db.collection('tasks').find({}).toArray()
    // Convert ObjectId to string for JSON serialization
    const tasksWithStringIds = tasks.map(task => ({
      ...task,
      id: task._id.toString(),
      _id: undefined
    }))
    return NextResponse.json(tasksWithStringIds)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const task = await request.json()
    const db = await getDatabase()
    
    const result = await db.collection('tasks').insertOne({
      ...task,
      createdAt: new Date().toISOString(),
    })
    
    return NextResponse.json({ 
      id: result.insertedId.toString(), 
      ...task,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const db = await getDatabase()
    
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }
    
    const db = await getDatabase()
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
