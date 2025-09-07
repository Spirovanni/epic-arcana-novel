import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    // For now, return empty - localStorage handles unauthenticated drafts
    // In future versions, this could load from database for authenticated users
    
    if (!userId) {
      return NextResponse.json({ 
        message: 'No authenticated user - check localStorage for drafts' 
      })
    }
    
    // TODO: Load user's latest draft from database
    return NextResponse.json({ 
      message: 'Database resume not yet implemented' 
    })
    
  } catch (error) {
    console.error('Error loading resume data:', error)
    
    return NextResponse.json(
      { error: 'Failed to load resume data' },
      { status: 500 }
    )
  }
}