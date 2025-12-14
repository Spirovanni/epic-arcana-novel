import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function ensureDbUser() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
  const firstName = clerkUser.firstName || 'User'
  const lastName = clerkUser.lastName || ''
  const imageUrl = clerkUser.imageUrl || ''
  const name = `${firstName} ${lastName}`.trim() || 'User'
  const now = new Date().toISOString()

  try {
    const [row] = await db.insert(users).values({
      clerkId: clerkUser.id,
      name,
      firstName,
      lastName,
      email,
      age: 25,
      imageUrl,
      lastSeenAt: now,
    }).onConflictDoUpdate({
      target: users.clerkId,
      set: {
        name,
        firstName,
        lastName,
        email,
        imageUrl,
        lastSeenAt: now,
        updatedAt: now,
      }
    }).returning()
    return row || null
  } catch (error) {
    // Fallback for deployments where newer columns aren't migrated yet
    console.error('[ensureDbUser] primary upsert failed, falling back to legacy shape', error)
    const [legacyRow] = await db.insert(users).values({
      clerkId: clerkUser.id,
      name,
      firstName,
      lastName,
      email,
      age: 25,
      imageUrl,
      lastSeenAt: now,
    }).onConflictDoUpdate({
      target: users.clerkId,
      set: {
        name,
        firstName,
        lastName,
        email,
        imageUrl,
        lastSeenAt: now,
        updatedAt: now,
      }
    }).returning()
    return legacyRow || null
  }
}
