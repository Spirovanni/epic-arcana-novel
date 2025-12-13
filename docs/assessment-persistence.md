# Assessment Persistence (v2)

This flow records every assessment answer to Neon through Clerk-authenticated API routes and new Drizzle tables.

## Tables
- `assessment_sessions_v2`: user-bound session with `status`, `isRetake`, timestamps.
- `assessment_answers_v2`: `UNIQUE(session_id, question_key)` JSONB answers plus `answer_type`.
- `assessment_results_v2`: one row per session.
- `users`: adds `last_seen_at` to track activity.

## Session Selection
- `/api/assessment/session` resolves the active session.
  - `?retake=true` always creates a new `in_progress` session flagged `isRetake`.
  - Otherwise resumes the most recent `in_progress` session or creates one if missing.
- The response includes `{ sessionId, answers }`; answers are keyed by question id with `{ answerType, value }`.

## API Contract
- `GET /api/assessment/session[?retake=true]`: returns session + answers after upserting the Clerk user.
- `POST /api/assessment/answer`: body `{ sessionId, questionKey, answerType, value }`, upserts with idempotent unique constraint.
- `POST /api/assessment/complete`: body `{ sessionId, result }`, stores JSON result and marks session completed.

All routes require Clerk auth and verify session ownership against the DB user (mapped via `clerkId`).

## UI Integration
- `AssessmentWizard` and `AdventureAssessmentWizard` now:
  - require Clerk sign-in before starting,
  - hydrate from `/api/assessment/session`,
  - debounce saves (≈350ms) and flush on pagehide/unload,
  - call `/api/assessment/answer` on every change,
  - flush pending saves before scoring, then `/api/assessment/complete` fires from `AuthGate`.

## Migrations
Use drizzle-kit to generate/apply migrations after updating `src/lib/schema.ts`:
```bash
npx drizzle-kit generate --schema=src/lib/schema.ts --out=drizzle
npx drizzle-kit push --schema=src/lib/schema.ts
```
Ensure Neon `DATABASE_URL` is set.

## Manual Test Plan
1) Sign in via Clerk and open `/assessment`.
2) Confirm a new session is returned from `GET /api/assessment/session`.
3) Answer a question; observe “Saving…” then “Saved” and verify `assessment_answers_v2` contains the answer (unique per question).
4) Refresh the page; answers hydrate from the server and the step resumes.
5) Append `?retake=true` and load; a new `assessment_sessions_v2` row is created and previous answers do not appear.
6) Complete the assessment; `assessment_results_v2` gains a row and the session status becomes `completed`.
