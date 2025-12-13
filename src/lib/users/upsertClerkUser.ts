import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

type ClerkEmailAddress = {
  email_address?: string
}

type ClerkUserPayload = {
  id: string
  email_addresses?: ClerkEmailAddress[]
  first_name?: string | null
  last_name?: string | null
}

/**
 * Idempotently upserts a Clerk user into the local users table using clerkId as the key.
 * Safe to call on every Clerk webhook or on-demand during API requests.
 */
export async function upsertClerkUser(payload: ClerkUserPayload) {
  if (!payload?.id) return null

  const email = payload.email_addresses?.[0]?.email_address || ''
  const firstName = payload.first_name || 'User'
  const lastName = payload.last_name || ''

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, payload.id))
    .limit(1)

  if (existing.length > 0) {
    const [user] = existing
    await db
      .update(users)
      .set({
        name: `${firstName} ${lastName}`.trim() || 'User',
        firstName,
        lastName,
        email,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, user.id))
    return user
  }

  const [created] = await db
    .insert(users)
    .values({
      clerkId: payload.id,
      name: `${firstName} ${lastName}`.trim() || 'User',
      firstName,
      lastName,
      email,
      age: 25
    })
    .returning()

  return created
}
