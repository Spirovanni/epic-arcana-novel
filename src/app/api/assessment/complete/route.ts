import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { assessmentResultsV2, assessmentSessionsV2 } from '@/lib/schema'
import { ensureDbUser } from '@/lib/server/users'
import { and, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  const dbUser = await ensureDbUser()
  if (!dbUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { sessionId, result } = body as { sessionId?: string; result?: unknown }

  if (!sessionId || !result) {
    return NextResponse.json({ error: 'Missing sessionId or result' }, { status: 400 })
  }

  const session = await db.select().from(assessmentSessionsV2)
    .where(and(eq(assessmentSessionsV2.id, sessionId), eq(assessmentSessionsV2.userId, dbUser.id)))
    .limit(1)

  if (!session.length) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const now = new Date().toISOString()

  await db.insert(assessmentResultsV2).values({
    sessionId,
    result,
    computedAt: now
  }).onConflictDoUpdate({
    target: assessmentResultsV2.sessionId,
    set: {
      result,
      computedAt: now
    }
  })

  await db.update(assessmentSessionsV2)
    .set({ status: 'completed', completedAt: now, updatedAt: now })
    .where(eq(assessmentSessionsV2.id, sessionId))

  return NextResponse.json({ ok: true, completedAt: now })
}
