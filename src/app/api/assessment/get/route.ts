import { NextRequest, NextResponse } from 'next/server'
import { AssessmentResultSchema } from '@/lib/assessment/types'
import fs from 'fs'
import path from 'path'

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
    
    // Load result from storage
    const result = await loadResult(resultId)
    
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

async function loadResult(resultId: string): Promise<any | null> {
  const dataDir = path.join(process.cwd(), 'data')
  const resultsFile = path.join(dataDir, '_local_results.json')
  
  try {
    if (!fs.existsSync(resultsFile)) {
      return null
    }
    
    const fileContent = fs.readFileSync(resultsFile, 'utf-8')
    const existingResults: Record<string, any> = JSON.parse(fileContent)
    
    return existingResults[resultId] || null
    
  } catch (error) {
    console.error('Error loading result:', error)
    return null
  }
}