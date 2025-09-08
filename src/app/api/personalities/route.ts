import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    // Get the personalities data file path
    const dataPath = path.join(process.cwd(), 'lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json')
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Personality profiles data not found' },
        { status: 404 }
      )
    }

    // Read and parse the personality profiles
    const fileContent = fs.readFileSync(dataPath, 'utf-8')
    const personalities = JSON.parse(fileContent)

    // Check for specific personality ID query param
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (profileId) {
      const personality = personalities.find((p: any) => p.id === profileId)
      if (!personality) {
        return NextResponse.json(
          { error: 'Personality profile not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(personality)
    }

    // Return all personalities
    return NextResponse.json(personalities)
  } catch (error) {
    console.error('Error loading personality profiles:', error)
    return NextResponse.json(
      { error: 'Failed to load personality profiles' },
      { status: 500 }
    )
  }
}