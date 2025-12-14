import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userAssessmentResults } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

async function ensureDbUser() {
  try {
    const user = await currentUser()
    if (!user) {
      console.log('[API] Result: No Clerk user found')
      return null
    }

    // 1. Try to find by Clerk ID
    const existing = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1)
    if (existing.length > 0) return existing[0]

    // 2. Try to find by Email
    const email = user.emailAddresses[0]?.emailAddress
    if (email) {
      console.log(`[API] Result: Clerk ID ${user.id} not found, checking email ${email}`)
      const existingByEmail = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (existingByEmail.length > 0) {
        console.log(`[API] Result: Linking existing user ${existingByEmail[0].id} to Clerk ID ${user.id}`)
        const [updated] = await db.update(users)
          .set({
            clerkId: user.id,
            firstName: user.firstName || existingByEmail[0].firstName,
            lastName: user.lastName || existingByEmail[0].lastName,
            imageUrl: user.imageUrl || existingByEmail[0].imageUrl
          })
          .where(eq(users.id, existingByEmail[0].id))
          .returning()
        return updated
      }
    }

    // 3. Create new user (if we reached result page without one, unusual but handle it)
    console.log(`[API] Result: Creating new user for Clerk ID ${user.id}`)
    try {
      const created = await db.insert(users).values({
        clerkId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        firstName: user.firstName || 'User',
        lastName: user.lastName || '',
        email: email || '',
        age: 25
      }).returning()
      return created[0]
    } catch (insertError: any) {
      if (insertError?.code === '23505') {
        const existingRetry = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1)
        if (existingRetry.length > 0) return existingRetry[0]
      }
      throw insertError
    }
  } catch (error) {
    console.error('[API] Result: User lookup failed:', error)
    return null
  }
}

export async function GET() {
  try {
    const dbUser = await ensureDbUser()
    console.log('[API] Result GET: dbUser found?', !!dbUser, dbUser?.id)

    if (!dbUser) {
      console.log('[API] Result: Unauthorized (no dbUser)')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Server database not configured' }, { status: 500 })
    }

    console.log('[API] Result - Querying results table for user:', dbUser.id)
    const results = await db.select().from(userAssessmentResults)
      .where(eq(userAssessmentResults.userId, dbUser.id))
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
