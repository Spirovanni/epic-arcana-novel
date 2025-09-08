import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AssessmentResultSchema } from '@/lib/assessment/types'
import { createResultId } from '@/lib/ids'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const result = AssessmentResultSchema.parse(body)
    
    // Check auth status
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to save assessment' },
        { status: 401 }
      )
    }
    
    // Check if user already has an assessment - if they do, we'll overwrite it for retake functionality
    const existingResult = await checkExistingResult(userId)
    
    // Generate a unique result ID
    const resultId = createResultId()
    
    // Determine storage approach
    const useFileSystem = !process.env.DATABASE_URL && !process.env.SUPABASE_URL
    
    if (useFileSystem) {
      // Store in local JSON file
      await saveToLocalFile(resultId, result, userId)
    } else {
      // TODO: Store in database (Supabase or Prisma)
      // For now, fall back to file system
      await saveToLocalFile(resultId, result, userId)
    }
    
    return NextResponse.json({ resultId })
    
  } catch (error) {
    console.error('Error saving assessment result:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid result data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to save assessment result' },
      { status: 500 }
    )
  }
}

async function saveToLocalFile(resultId: string, result: unknown, userId: string | null) {
  const dataDir = path.join(process.cwd(), 'data')
  const resultsFile = path.join(dataDir, '_local_results.json')
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Load existing results
  let existingResults: Record<string, unknown> = {}
  try {
    if (fs.existsSync(resultsFile)) {
      const fileContent = fs.readFileSync(resultsFile, 'utf-8')
      existingResults = JSON.parse(fileContent)
    }
  } catch {
    console.warn('Could not load existing results, starting fresh')
  }
  
  // Remove any previous result for this user (for retake functionality)
  if (userId) {
    const previousResultId = Object.keys(existingResults).find(id => 
      (existingResults[id] as any)?.userId === userId
    )
    if (previousResultId) {
      delete existingResults[previousResultId]
    }
  }
  
  // Add the new result
  existingResults[resultId] = {
    ...(result as Record<string, unknown>),
    userId,
    savedAt: new Date().toISOString(),
    resultId
  }
  
  // Save back to file
  fs.writeFileSync(resultsFile, JSON.stringify(existingResults, null, 2))
}

async function checkExistingResult(userId: string) {
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
    console.error('Error checking existing results:', error)
    return null
  }
}