import 'dotenv/config'
import fetch from 'node-fetch'
import { db } from '../src/lib/db'
import { users } from '../src/lib/schema'
import { eq } from 'drizzle-orm'
import path from 'path'
import * as dotenv from 'dotenv'

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
const CLERK_API_BASE = process.env.CLERK_API_BASE || 'https://api.clerk.com/v1'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Exiting.')
  process.exit(1)
}

if (!CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY is not set. Exiting.')
  process.exit(1)
}

type ClerkUser = {
  id: string
  first_name?: string | null
  last_name?: string | null
  email_addresses?: Array<{ email_address?: string }>
  image_url?: string
}

async function fetchClerkUsers(offset: number, limit: number): Promise<ClerkUser[]> {
  const url = `${CLERK_API_BASE}/users?limit=${limit}&offset=${offset}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` }
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Clerk API error (${res.status}): ${body}`)
  }

  const data = await res.json()
  // Clerk returns an array; guard for future pagination shapes
  if (Array.isArray(data)) return data as ClerkUser[]
  if (Array.isArray((data as any)?.data)) return (data as any).data as ClerkUser[]
  throw new Error('Unexpected Clerk API response shape')
}

async function upsertClerkUser(user: ClerkUser) {
  const email = user.email_addresses?.[0]?.email_address
  if (!email) {
    console.warn(`User ${user.id} has no email, skipping.`)
    return
  }

  // 1. Check if user exists by Clerk ID and update
  const existingByClerkId = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1)
  if (existingByClerkId.length > 0) {
    console.log(`Updating existing user by Clerk ID: ${user.id}`)
    await db.update(users).set({
      firstName: user.first_name || existingByClerkId[0].firstName,
      lastName: user.last_name || existingByClerkId[0].lastName,
      imageUrl: user.image_url || existingByClerkId[0].imageUrl || ''
    }).where(eq(users.clerkId, user.id))
    return
  }

  // 2. Check if user exists by Email (legacy/seed data) and link
  const existingByEmail = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existingByEmail.length > 0) {
    console.log(`Linking existing user by email ${email} to Clerk ID ${user.id}`)
    await db.update(users).set({
      clerkId: user.id,
      firstName: user.first_name || existingByEmail[0].firstName,
      lastName: user.last_name || existingByEmail[0].lastName,
      imageUrl: user.image_url || existingByEmail[0].imageUrl || ''
    }).where(eq(users.id, existingByEmail[0].id))
    return
  }

  // 3. Create new user
  console.log(`Creating new user: ${email}`)
  await db.insert(users).values({
    clerkId: user.id,
    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
    firstName: user.first_name || 'User',
    lastName: user.last_name || '',
    email: email,
    age: 25,
    imageUrl: user.image_url || ''
  })
}

async function run() {
  const limit = 100
  let offset = 0
  let processed = 0

  while (true) {
    const batch = await fetchClerkUsers(offset, limit)
    if (batch.length === 0) break

    for (const user of batch) {
      await upsertClerkUser(user)
      processed += 1
    }

    if (batch.length < limit) break
    offset += limit
  }

  console.log(`Backfill complete. Processed ${processed} users.`)
}

run().catch((error) => {
  console.error('Backfill failed:', error)
  process.exit(1)
})
