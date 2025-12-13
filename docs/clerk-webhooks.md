## Clerk Webhooks

- Endpoint: `https://<your-domain>/api/clerk/webhook` (e.g., `https://www.epicarcana.com/api/clerk/webhook`)
- Signing secret: In Clerk Dashboard → Webhooks → your endpoint → “Signing secret”. Set env:
  - `CLERK_WEBHOOK_SIGNING_SECRET=<secret>`
  - Optional fallback: `CLERK_WEBHOOK_SECRET=<secret>`
- Supported events: `user.created`, `user.updated`, `user.deleted`
- Idempotency: events are recorded in `webhook_events` (unique `event_id`); duplicates return `{ ok: true, duplicate: true }`.
- DB sync: users upserted/deleted in the `users` table using `clerkUserId` (clerk_id), email, name, first/last, imageUrl.
- Testing: From Clerk dashboard, “Send test event” to the deployed URL; check server logs for `[Clerk webhook] { eventId, eventType, clerkUserId, ts }`.
- Deploy: Use the deployed URL for live webhooks; local URLs will not receive hosted webhooks unless you tunnel (ngrok, etc.).
