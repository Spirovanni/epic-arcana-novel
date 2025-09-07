import { NextRequest, NextResponse } from 'next/server'
import { AssessmentAnswersSchema } from '@/lib/assessment/types'
import { scoreAssessment } from '@/lib/scoring/engine'
import { getForcedChoiceItems } from '@/lib/items/forced'
import { getLikertItems } from '@/lib/items/likert'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const answers = AssessmentAnswersSchema.parse(body)
    
    // Get assessment items
    const forcedChoiceItems = getForcedChoiceItems()
    const likertItems = getLikertItems()
    
    // Calculate the result
    const result = await scoreAssessment(answers, forcedChoiceItems, likertItems)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error scoring assessment:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to score assessment' },
      { status: 500 }
    )
  }
}