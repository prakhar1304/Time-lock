import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/time-lock'
  
  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('time-lock')
    
    console.log('Connected to MongoDB successfully')
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

export async function closeDatabase() {
  if (client) {
    await client.close()
    console.log('MongoDB connection closed')
  }
}
