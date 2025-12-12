import { NextRequest, NextResponse } from 'next/server'
import { AssessmentResultSchema } from '@/lib/assessment/types'
import { db } from '@/lib/db'
import { userAssessmentResults } from '@/lib/schema'
import { eq, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get('id')
    
    if (!resultId) {
      return NextResponse.json(
        { error: 'Result ID is required' },
        { status: 400 }
      )
    }
    
    // Load result from database (assessmentId or row id)
    const rows = await db.select().from(userAssessmentResults)
      .where(
        or(
          eq(userAssessmentResults.assessmentId, resultId),
          eq(userAssessmentResults.id, resultId)
        )
      )
      .limit(1)

    const result = rows[0]?.personalityProfile
    
    if (!result) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }
    
    // Validate the result
    const validatedResult = AssessmentResultSchema.parse(result)
    
    return NextResponse.json(validatedResult)
    
  } catch (error) {
    console.error('Error getting assessment result:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid result data', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to get assessment result' },
      { status: 500 }
    )
  }
}
