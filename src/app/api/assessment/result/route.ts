import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userAssessmentResults } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Look up internal user id
    const existingUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    const results = await db.select().from(userAssessmentResults)
      .where(eq(userAssessmentResults.userId, existingUser[0].id))
      .orderBy(desc(userAssessmentResults.completedAt))
      .limit(1)

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    return NextResponse.json(results[0].personalityProfile)
    
  } catch (error) {
    console.error('Error retrieving assessment result:', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve assessment result' },
      { status: 500 }
    )
  }
}
