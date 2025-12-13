import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userAssessmentResults } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Catch auth failures so they do not bubble as 500s
    const authResult = await auth().catch((error) => {
      console.error('[API] Result - Clerk auth failed:', error)
      return { userId: null }
    })
    const userId = authResult?.userId || null
    console.log('[API] Result - userId:', userId)

    if (!userId) {
      console.log('[API] Result - No userId, returning 401')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!process.env.DATABASE_URL) {
      console.error('[API] Result - DATABASE_URL is not configured')
      return NextResponse.json(
        { error: 'Server database not configured' },
        { status: 500 }
      )
    }

    // Look up internal user id
    const existingUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
    console.log('[API] Result - existingUser found:', existingUser.length > 0, existingUser.length > 0 ? `ID: ${existingUser[0].id}` : '')

    if (existingUser.length === 0) {
      console.log('[API] Result - User not found in DB for clerkId:', userId)
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    console.log('[API] Result - Querying results table for user:', existingUser[0].id)
    const results = await db.select().from(userAssessmentResults)
      .where(eq(userAssessmentResults.userId, existingUser[0].id))
      .orderBy(desc(userAssessmentResults.completedAt))
      .limit(1)

    console.log('[API] Result - Query result count:', results.length)

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    const profile = results[0].personalityProfile as Record<string, unknown> | null
    const completedAt = results[0].completedAt
    const metadata = {
      resultId: results[0].id,
      assessmentId: results[0].assessmentId,
      completedAt: completedAt instanceof Date ? completedAt.toISOString() : completedAt
    }

    console.log('[API] Result - Returning success')
    return NextResponse.json({
      ...(profile || {}),
      ...metadata
    })

  } catch (error) {
    console.error('[API] Error retrieving assessment result:', error)
    // Detailed logging for debugging
    if (error instanceof Error) {
      console.error('[API] Stack:', error.stack)
      console.error('[API] Message:', error.message)
    }

    return NextResponse.json(
      { error: 'Failed to retrieve assessment result', details: String(error) },
      { status: 500 }
    )
  }
}
