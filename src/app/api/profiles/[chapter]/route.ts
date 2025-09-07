import { NextRequest, NextResponse } from 'next/server'
import { loadCanonicalProfiles } from '@/lib/data'

interface RouteParams {
  params: Promise<{
    chapter: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { chapter } = await params
    const chapterNum = parseInt(chapter, 10)
    
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 360) {
      return NextResponse.json(
        { error: 'Invalid chapter number. Must be between 1 and 360.' },
        { status: 400 }
      )
    }
    
    const profiles = await loadCanonicalProfiles()
    const profile = profiles.find(p => p.chapter === chapterNum)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(profile)
    
  } catch (error) {
    console.error('Error loading profile:', error)
    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}