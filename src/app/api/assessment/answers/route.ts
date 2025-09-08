import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AssessmentAnswersSchema } from '@/lib/assessment/types'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const answers = AssessmentAnswersSchema.parse(body)
    
    // Check auth status
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to save answers' },
        { status: 401 }
      )
    }
    
    // Store answers locally
    await saveAnswersToLocalFile(userId, answers)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error saving assessment answers:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid answers data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to save assessment answers' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check auth status
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Load user's answers
    const answers = await loadUserAnswers(userId)
    
    if (!answers) {
      return NextResponse.json(
        { error: 'No answers found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(answers)
    
  } catch (error) {
    console.error('Error loading assessment answers:', error)
    return NextResponse.json(
      { error: 'Failed to load assessment answers' },
      { status: 500 }
    )
  }
}

async function saveAnswersToLocalFile(userId: string, answers: unknown) {
  const dataDir = path.join(process.cwd(), 'data')
  const answersFile = path.join(dataDir, '_local_answers.json')
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Load existing answers
  let existingAnswers: Record<string, unknown> = {}
  try {
    if (fs.existsSync(answersFile)) {
      const fileContent = fs.readFileSync(answersFile, 'utf-8')
      existingAnswers = JSON.parse(fileContent)
    }
  } catch {
    console.warn('Could not load existing answers, starting fresh')
  }
  
  // Add the new answers
  existingAnswers[userId] = {
    ...(answers as Record<string, unknown>),
    savedAt: new Date().toISOString()
  }
  
  // Save back to file
  fs.writeFileSync(answersFile, JSON.stringify(existingAnswers, null, 2))
}

async function loadUserAnswers(userId: string) {
  const dataDir = path.join(process.cwd(), 'data')
  const answersFile = path.join(dataDir, '_local_answers.json')
  
  try {
    if (!fs.existsSync(answersFile)) {
      return null
    }
    
    const fileContent = fs.readFileSync(answersFile, 'utf-8')
    const existingAnswers: Record<string, any> = JSON.parse(fileContent)
    
    return existingAnswers[userId] || null
    
  } catch (error) {
    console.error('Error loading answers:', error)
    return null
  }
}