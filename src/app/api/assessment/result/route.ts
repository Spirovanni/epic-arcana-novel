import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Determine storage approach
    const useFileSystem = !process.env.DATABASE_URL && !process.env.SUPABASE_URL
    
    if (useFileSystem) {
      const result = await getFromLocalFile(userId)
      if (result) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
      }
    } else {
      // TODO: Get from database (Supabase or Prisma)
      // For now, fall back to file system
      const result = await getFromLocalFile(userId)
      if (result) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
      }
    }
    
  } catch (error) {
    console.error('Error retrieving assessment result:', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve assessment result' },
      { status: 500 }
    )
  }
}

async function getFromLocalFile(userId: string) {
  const dataDir = path.join(process.cwd(), 'data')
  const resultsFile = path.join(dataDir, '_local_results.json')
  
  try {
    if (!fs.existsSync(resultsFile)) {
      return null
    }
    
    const fileContent = fs.readFileSync(resultsFile, 'utf-8')
    const existingResults: Record<string, any> = JSON.parse(fileContent)
    
    // Find the result for this user
    const userResult = Object.values(existingResults).find(
      result => result.userId === userId
    )
    
    return userResult || null
    
  } catch (error) {
    console.error('Error reading results file:', error)
    return null
  }
}