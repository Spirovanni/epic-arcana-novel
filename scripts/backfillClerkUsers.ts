import 'dotenv/config'
import fetch from 'node-fetch'
import { upsertClerkUser } from '@/lib/users/upsertClerkUser'

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

async function run() {
  const limit = 100
  let offset = 0
  let processed = 0

  while (true) {
    const batch = await fetchClerkUsers(offset, limit)
    if (batch.length === 0) break

    for (const user of batch) {
      await upsertClerkUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_addresses: user.email_addresses
      })
      processed += 1
    }

    if (batch.length < limit) break
    offset += limit
  }

  console.log(`Backfill complete. Upserted ${processed} users.`)
}

run().catch((error) => {
  console.error('Backfill failed:', error)
  process.exit(1)
})
