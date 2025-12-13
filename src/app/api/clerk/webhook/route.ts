import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook, type WebhookEvent } from '@clerk/nextjs/webhooks'
import { db } from '@/lib/db'
import { webhookEvents } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { handleUserCreated, handleUserDeleted, handleUserUpdated, markEventProcessed } from '@/lib/clerkWebhookHandlers'

function getSigningSecret() {
  return process.env.CLERK_WEBHOOK_SIGNING_SECRET || process.env.CLERK_WEBHOOK_SECRET || ''
}

async function processEvent(evt: WebhookEvent) {
  const eventId = (evt as any)?.id as string | undefined
  const eventType = evt.type as string | undefined
  if (!eventId || !eventType) {
    throw new Error('Missing event id or type')
  }

  const clerkUserId = (evt.data as any)?.id as string | undefined
  console.log('[Clerk webhook]', {
    eventId,
    eventType,
    clerkUserId,
    ts: new Date().toISOString()
  })

  return db.transaction(async (tx) => {
    const existing = await tx.select().from(webhookEvents).where(eq(webhookEvents.eventId, eventId)).limit(1)
    if (existing.length > 0) {
      return { duplicate: true }
    }

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(tx, evt)
        break
      case 'user.updated':
        await handleUserUpdated(tx, evt)
        break
      case 'user.deleted':
        await handleUserDeleted(tx, evt)
        break
      default:
        // Unknown event types are marked processed to avoid retries
        break
    }

    await markEventProcessed(tx, eventId, eventType)
    return { duplicate: false }
  })
}

export async function POST(req: NextRequest) {
  const signingSecret = getSigningSecret()
  if (!signingSecret) {
    console.error('Clerk webhook signing secret is not configured')
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  let evt: WebhookEvent
  try {
    evt = await verifyWebhook(req, { signingSecret })
  } catch (error) {
    console.error('Clerk webhook verification failed', error)
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    const result = await processEvent(evt)
    return NextResponse.json({ ok: true, duplicate: !!result.duplicate })
  } catch (error) {
    console.error('Clerk webhook handler error', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ ok: false }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ ok: false }, { status: 405 })
}
