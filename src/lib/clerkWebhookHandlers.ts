import { db } from '@/lib/db'
import { users, webhookEvents } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import type { WebhookEvent } from '@clerk/nextjs/webhooks'

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0]
export type DbOrTx = typeof db | TransactionClient

function extractUserFields(evt: WebhookEvent) {
  const data: any = evt.data || {}
  const clerkUserId = data.id as string | undefined
  const primaryEmail = Array.isArray(data.email_addresses)
    ? data.email_addresses[0]?.email_address
    : undefined

  const firstName = (data.first_name as string) || 'User'
  const lastName = (data.last_name as string) || ''
  const email = primaryEmail || `${clerkUserId || 'unknown'}@example.invalid`
  const imageUrl = (data.image_url as string) || ''

  return {
    clerkUserId,
    firstName,
    lastName,
    email,
    imageUrl,
    name: `${firstName} ${lastName}`.trim() || 'User',
  }
}

export async function handleUserCreated(database: DbOrTx, evt: WebhookEvent) {
  const { clerkUserId, firstName, lastName, email, imageUrl, name } = extractUserFields(evt)
  if (!clerkUserId) return

  const now = new Date().toISOString()

  try {
    await database.insert(users)
      .values({
        clerkId: clerkUserId,
        firstName,
        lastName,
        email,
        name,
        age: 25,
        updatedAt: now,
        imageUrl,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          firstName,
          lastName,
          email,
          name,
          updatedAt: now,
          imageUrl,
        }
      })
  } catch (error) {
    console.error('[handleUserCreated] user upsert failed, using legacy shape', error)
    await database.insert(users)
      .values({
        clerkId: clerkUserId,
        firstName,
        lastName,
        email,
        name,
        age: 25,
        updatedAt: now,
        imageUrl,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          firstName,
          lastName,
          email,
          name,
          updatedAt: now,
          imageUrl,
        }
      })
  }
}

export async function handleUserUpdated(database: DbOrTx, evt: WebhookEvent) {
  const { clerkUserId, firstName, lastName, email, imageUrl, name } = extractUserFields(evt)
  if (!clerkUserId) return

  const now = new Date().toISOString()

  try {
    await database.insert(users)
      .values({
        clerkId: clerkUserId,
        firstName,
        lastName,
        email,
        name,
        age: 25,
        updatedAt: now,
        imageUrl,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          firstName,
          lastName,
          email,
          name,
          updatedAt: now,
          imageUrl,
        }
      })
  } catch (error) {
    console.error('[handleUserUpdated] user upsert failed, using legacy shape', error)
    await database.insert(users)
      .values({
        clerkId: clerkUserId,
        firstName,
        lastName,
        email,
        name,
        age: 25,
        updatedAt: now,
        imageUrl,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          firstName,
          lastName,
          email,
          name,
          updatedAt: now,
          imageUrl,
        }
      })
  }
}

export async function handleUserDeleted(database: DbOrTx, evt: WebhookEvent) {
  const data: any = evt.data || {}
  const clerkUserId = data.id as string | undefined
  if (!clerkUserId) return

  await database.delete(users).where(eq(users.clerkId, clerkUserId))
}

export async function markEventProcessed(database: DbOrTx, eventId: string, eventType: string) {
  await database.insert(webhookEvents).values({
    eventId,
    eventType,
  })
}
