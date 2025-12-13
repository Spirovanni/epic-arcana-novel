import { NextRequest, NextResponse } from 'next/server'
import { Webhook, WebhookRequiredHeaders } from 'svix'
import { upsertClerkUser } from '@/lib/users/upsertClerkUser'

export const runtime = 'nodejs'

function getSvixHeaders(req: NextRequest): WebhookRequiredHeaders {
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error('Missing Svix signature headers')
  }

  return {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text()

  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let evt: any
  try {
    const headers = getSvixHeaders(req)
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    evt = wh.verify(payload, headers)
  } catch (error) {
    console.error('Clerk webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const eventType = evt?.type
  const data = evt?.data

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      await upsertClerkUser({
        id: data?.id,
        email_addresses: data?.email_addresses,
        first_name: data?.first_name,
        last_name: data?.last_name
      })
    }
  } catch (error) {
    console.error('Clerk webhook handler error:', error)
    // Return 200 so Clerk does not retry indefinitely; log for follow-up
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
