import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AssessmentAnswersSchema } from '@/lib/assessment/types'

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
    
    // In production we skip file persistence; integrate DB when ready
    return NextResponse.json({ success: true, note: 'Answers received (persistence disabled in production).' })
    
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
    
    return NextResponse.json(
      { error: 'Answer persistence not enabled in this environment' },
      { status: 404 }
    )
    
  } catch (error) {
    console.error('Error loading assessment answers:', error)
    return NextResponse.json(
      { error: 'Failed to load assessment answers' },
      { status: 500 }
    )
  }
}
